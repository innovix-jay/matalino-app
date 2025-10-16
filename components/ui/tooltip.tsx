import * as React from "react"

interface TooltipProps {
  children: React.ReactNode
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

export function TooltipProvider({ children }: TooltipProps) {
  return <>{children}</>
}

export function Tooltip({ children }: TooltipProps) {
  return <div className="relative inline-block">{children}</div>
}

export function TooltipTrigger({ children }: TooltipTriggerProps) {
  return <>{children}</>
}

export function TooltipContent({ children, className }: TooltipContentProps) {
  return (
    <div className={`absolute z-50 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-md ${className || ''}`}>
      {children}
    </div>
  )
}

