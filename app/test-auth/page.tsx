'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'

export default function TestAuthPage() {
  const [email, setEmail] = useState('jay.cadmus@innovixdynamix.com')
  const [password, setPassword] = useState('Jaychanti78!')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, signInWithEmail, signOut } = useAuth()

  const handleEmailLogin = async () => {
    try {
      setLoading(true)
      setMessage('')
      await signInWithEmail(email, password)
      setMessage('✅ Login successful!')
    } catch (error) {
      setMessage(`❌ Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setMessage('✅ Signed out successfully!')
    } catch (error) {
      setMessage(`❌ Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded">
            <h2 className="text-lg font-semibold text-green-800">✅ Logged In</h2>
            <p className="text-green-700">Email: {user.email}</p>
            <p className="text-green-700">ID: {user.id}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
          
          <div className="mt-4">
            <a 
              href="/dashboard" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Email/Password Test</h2>
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Password"
              />
              <button 
                onClick={handleEmailLogin}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Test Email Login'}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Google OAuth Test</h2>
            <a 
              href="/auth/login" 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
            >
              Test Google OAuth
            </a>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-600">
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
        <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      </div>
    </div>
  )
}
