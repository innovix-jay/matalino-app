'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugAuthPage() {
  const [supabaseConfig, setSupabaseConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const supabase = createClient()
        
        // Check if we can connect to Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        setSupabaseConfig({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          sessionError: sessionError?.message,
          currentSession: !!session,
          userEmail: session?.user?.email,
          redirectUrl: `${window.location.origin}/auth/callback`
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    checkConfig()
  }, [])

  const testGoogleOAuth = async () => {
    try {
      setError(null)
      const supabase = createClient()
      const redirectUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        : `${window.location.origin}/auth/callback`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      })
      if (error) {
        setError(`OAuth Error: ${error.message}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown OAuth error')
    }
  }

  if (loading) {
    return <div className="p-8">Loading debug info...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Supabase Configuration</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(supabaseConfig, null, 2)}
          </pre>
        </div>

        {error && (
          <div className="bg-red-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2 text-red-800">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={testGoogleOAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Google OAuth
          </button>
          
          <div className="text-sm text-gray-600">
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Redirect URL:</strong> {window.location.origin}/auth/callback</p>
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

