import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bot, AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Matalino</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              There was an issue with your authentication. Please try signing in again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>This could happen if:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>The authentication link has expired</li>
                <li>There was a network error</li>
                <li>The authentication provider returned an error</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link href="/auth/login">
                <Button className="w-full">
                  Try Signing In Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go Back Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
