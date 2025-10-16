'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { addSubscriber, getSubscribers, deleteSubscriber } from '@/lib/actions/subscribers'

interface EditableSubscriber {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  tags?: string[]
  is_active?: boolean
}

export default function SubscribersPage() {
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState<EditableSubscriber[]>([])
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const refresh = async () => {
    setLoading(true)
    try {
      const list = await getSubscribers()
      setSubscribers(list as any)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const add = async () => {
    if (!email) return
    await addSubscriber({ email, first_name: firstName || null as any, last_name: lastName || null as any, tags: [], is_active: true } as any)
    setEmail(''); setFirstName(''); setLastName('')
    await refresh()
  }

  const remove = async (id: string) => {
    await deleteSubscriber(id)
    await refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add subscriber</CardTitle>
          <CardDescription>Quickly add a single subscriber</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="px-3 py-2 border rounded-md" />
          <input placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="px-3 py-2 border rounded-md" />
          <input placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} className="px-3 py-2 border rounded-md" />
          <Button onClick={add}>Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>Your audience list</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscribers yet.</p>
          ) : (
            <div className="divide-y">
              {subscribers.map((s: any) => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.email}</p>
                    <p className="text-sm text-muted-foreground">{[s.first_name, s.last_name].filter(Boolean).join(' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => remove(s.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



