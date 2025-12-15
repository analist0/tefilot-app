"use client"

import { useState } from "react"
import type { KavanaInfo } from "@/lib/tehilim/types"
import { cn } from "@/lib/utils"

interface HolyNameProps {
  name: string
  kavana?: KavanaInfo
  isActive?: boolean
}

export function HolyName({ name, kavana, isActive }: HolyNameProps) {
  const [showKavana, setShowKavana] = useState(false)

  return (
    <span className="relative inline-block">
      <span
        className={cn(
          "font-bold cursor-pointer transition-all duration-300",
          "text-amber-500 dark:text-amber-400",
          "drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]",
          "hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]",
          isActive && "scale-110 animate-pulse",
        )}
        onMouseEnter={() => setShowKavana(true)}
        onMouseLeave={() => setShowKavana(false)}
        onTouchStart={() => setShowKavana(true)}
        onTouchEnd={() => setTimeout(() => setShowKavana(false), 2000)}
      >
        {name}
      </span>

      {showKavana && kavana && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50",
            "animate-in fade-in-0 zoom-in-95 duration-200",
          )}
        >
          <div className="bg-gray-900 dark:bg-gray-800 text-white px-3 py-2 rounded-xl shadow-xl whitespace-nowrap">
            <div className="text-[10px] text-gray-400 mb-0.5">כוונה:</div>
            <div className={cn("text-sm font-medium", kavana.color)}>{kavana.kavana}</div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
            </div>
          </div>
        </div>
      )}
    </span>
  )
}
