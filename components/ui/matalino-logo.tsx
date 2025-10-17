import React from 'react'

interface MatalinoLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export function MatalinoLogo({ size = 'md', showText = true, className = '' }: MatalinoLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Matalino Brain Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg 
          viewBox="0 0 64 64" 
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rounded square */}
          <rect 
            x="8" y="8" 
            width="48" height="48" 
            rx="8" 
            stroke="url(#gradient)" 
            strokeWidth="2"
            fill="none"
          />
          
          {/* Brain outline */}
          <path 
            d="M20 24 C20 16, 24 12, 32 12 C40 12, 44 16, 44 24 C44 28, 42 32, 40 34 C42 36, 44 40, 44 44 C44 48, 40 52, 32 52 C24 52, 20 48, 20 44 C20 40, 22 36, 24 34 C22 32, 20 28, 20 24 Z" 
            stroke="url(#gradient)" 
            strokeWidth="2"
            fill="none"
          />
          
          {/* Line graph inside brain */}
          <path 
            d="M24 36 L28 32 L32 28 L36 24 L40 20" 
            stroke="url(#gradient)" 
            strokeWidth="2"
            fill="none"
          />
          
          {/* Data points */}
          <circle cx="24" cy="36" r="2" fill="url(#gradient)" />
          <circle cx="28" cy="32" r="2" fill="url(#gradient)" />
          <circle cx="32" cy="28" r="2" fill="url(#gradient)" />
          <circle cx="36" cy="24" r="2" fill="url(#gradient)" />
          <circle cx="40" cy="20" r="3" fill="url(#gradient)" />
          
          {/* Bar chart */}
          <rect x="26" y="40" width="3" height="8" fill="url(#gradient)" />
          <rect x="31" y="36" width="3" height="12" fill="url(#gradient)" />
          <rect x="36" y="32" width="3" height="16" fill="url(#gradient)" />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <div>
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent`}>
            Matalino
          </span>
          <p className="text-xs text-gray-500 dark:text-gray-400">by Innovix Dynamix</p>
        </div>
      )}
    </div>
  )
}
