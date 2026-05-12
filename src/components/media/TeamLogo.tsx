'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { getNBATeamLogoUrl, getNBATeamId, getTeamAbbr, getTeamColor } from '@/lib/utils/constants'

interface TeamLogoProps {
  teamName: string
  teamId?: string | number | null
  logoUrl?: string | null
  size?: number
  className?: string
  priority?: boolean
}

export function TeamLogo({
  teamName,
  teamId,
  logoUrl,
  size = 32,
  className,
  priority = false,
}: TeamLogoProps) {
  const [imgError, setImgError] = useState(false)

  const resolvedTeamId = teamId ?? getNBATeamId(teamName)
  const src = imgError || (!resolvedTeamId && !logoUrl)
    ? null
    : logoUrl || (resolvedTeamId ? getNBATeamLogoUrl(resolvedTeamId) : null)

  const abbr  = getTeamAbbr(teamName)
  const color = getTeamColor(teamName)

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-md flex items-center justify-center font-black shrink-0 select-none',
          className,
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color + '25',
          color,
          fontSize: size * 0.28,
        }}
      >
        {abbr.slice(0, 3)}
      </div>
    )
  }

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={teamName}
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority={priority}
        onError={() => setImgError(true)}
      />
    </div>
  )
}
