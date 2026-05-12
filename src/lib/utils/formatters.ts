export function fmtPct(val: number | undefined | null, decimals = 1): string {
  if (val == null) return '—'
  return (val * 100).toFixed(decimals) + '%'
}

export function fmtStat(val: number | undefined | null, decimals = 1): string {
  if (val == null) return '—'
  return Number(val).toFixed(decimals)
}

export function fmtDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function fmtShortDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function fmtGameTime(dateStr: string): string {
  if (!dateStr) return 'TBD'
  try {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return dateStr
  }
}

export function fmtRecord(wins: number, losses: number): string {
  return `${wins}-${losses}`
}

export function fmtWinPct(pct: number): string {
  return pct.toFixed(3).replace(/^0/, '')
}

export function fmtContract(value: string | undefined): string {
  return value ?? '—'
}

export function fmtHeight(height: string | undefined): string {
  return height ?? '—'
}

export function fmtPlusMinus(val: number | undefined | null): string {
  if (val == null) return '—'
  return val >= 0 ? `+${val}` : String(val)
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'live':      return 'LIVE'
    case 'final':     return 'Final'
    case 'scheduled': return 'Upcoming'
    default:          return status
  }
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
