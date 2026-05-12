'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const run = useCallback(() => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    setError(null)

    fetcherRef.current()
      .then((res) => {
        if (!ctrl.signal.aborted) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!ctrl.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      })
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run() }, [...deps, run])

  useEffect(() => () => { abortRef.current?.abort() }, [])

  return { data, loading, error, refetch: run }
}
