'use client'

import { useEffect, useCallback } from 'react'
import { getWsClient } from '@/lib/websocket/client'
import type { WsMessage } from '@/types'

export function useWebSocket(
  onMessage: (msg: WsMessage) => void,
  enabled = true,
) {
  const stableHandler = useCallback(onMessage, [onMessage])

  useEffect(() => {
    if (!enabled) return
    const client = getWsClient()
    client.connect()
    const unsub = client.subscribe(stableHandler)
    return () => { unsub() }
  }, [enabled, stableHandler])
}
