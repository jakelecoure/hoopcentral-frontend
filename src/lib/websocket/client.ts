'use client'

import type { WsMessage } from '@/types'
import { WS_RECONNECT_DELAY, WS_MAX_RETRIES } from '@/lib/utils/constants'

type MessageHandler = (msg: WsMessage) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private handlers = new Set<MessageHandler>()
  private retries = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private manualClose = false
  private url: string

  constructor(url: string) {
    this.url = url
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return
    this.manualClose = false

    try {
      this.ws = new WebSocket(this.url)

      this.ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as WsMessage
          this.handlers.forEach((h) => h(msg))
        } catch {
          // ignore malformed messages
        }
      }

      this.ws.onclose = () => {
        if (!this.manualClose && this.retries < WS_MAX_RETRIES) {
          this.retries++
          this.reconnectTimer = setTimeout(() => this.connect(), WS_RECONNECT_DELAY * this.retries)
        }
      }

      this.ws.onopen = () => {
        this.retries = 0
      }

      this.ws.onerror = () => {
        this.ws?.close()
      }
    } catch {
      // WebSocket not available (e.g. SSR)
    }
  }

  disconnect() {
    this.manualClose = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton — one connection shared across the app
let _client: WebSocketClient | null = null

export function getWsClient(): WebSocketClient {
  if (!_client) {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'}/ws/live`
    _client = new WebSocketClient(wsUrl)
  }
  return _client
}
