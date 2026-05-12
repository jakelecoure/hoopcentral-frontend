'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { getNBAHeadshotUrl, getTeamColor } from '@/lib/utils/constants'

interface PlayerHeadshotProps {
  nbaId?: string | number | null
  photoUrl?: string | null
  name: string
  team?: string
  size?: number
  className?: string
  priority?: boolean
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  return parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : name.slice(0, 2)
}

export function PlayerHeadshot({
  nbaId,
  photoUrl,
  name,
  team = '',
  size = 64,
  className,
  priority = false,
}: PlayerHeadshotProps) {
  const [imgError, setImgError] = useState(false)

  const src = imgError || (!nbaId && !photoUrl)
    ? null
    : photoUrl || (nbaId ? getNBAHeadshotUrl(nbaId) : null)

  const color = getTeamColor(team)

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-black text-sm shrink-0 select-none',
          className,
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: color + '25',
          color,
          fontSize: size * 0.3,
        }}
      >
        {getInitials(name).toUpperCase()}
      </div>
    )
  }

  return (
    <div
      className={cn('relative rounded-full overflow-hidden shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-cover object-top"
        priority={priority}
        onError={() => setImgError(true)}
      />
    </div>
  )
}
