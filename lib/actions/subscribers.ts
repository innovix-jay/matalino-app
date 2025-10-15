'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface EmailSubscriber {
  id: string
  creator_id: string
  email: string
  first_name: string | null
  last_name: string | null
  tags: string[]
  is_active: boolean
  subscribed_at: string
}

export async function getSubscribers(): Promise<EmailSubscriber[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('email_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false })

  if (error) {
    console.error('Error fetching subscribers:', error)
    throw new Error('Failed to fetch subscribers')
  }

  return data || []
}

export async function addSubscriber(subscriberData: Omit<EmailSubscriber, 'id' | 'creator_id' | 'subscribed_at'>) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('email_subscribers')
    .insert([{
      ...subscriberData,
      creator_id: user.id
    }])
    .select()
    .single()

  if (error) {
    console.error('Error adding subscriber:', error)
    throw new Error('Failed to add subscriber')
  }

  revalidatePath('/dashboard')
  return data
}

export async function updateSubscriber(id: string, updates: Partial<EmailSubscriber>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('email_subscribers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscriber:', error)
    throw new Error('Failed to update subscriber')
  }

  revalidatePath('/dashboard')
  return data
}

export async function deleteSubscriber(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('email_subscribers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting subscriber:', error)
    throw new Error('Failed to delete subscriber')
  }

  revalidatePath('/dashboard')
}

export async function getSubscribersCount(): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('email_subscribers')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting subscribers:', error)
    return 0
  }

  return count || 0
}

export async function importSubscribers(subscribers: Omit<EmailSubscriber, 'id' | 'creator_id' | 'subscribed_at'>[]) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  const subscribersWithCreatorId = subscribers.map(subscriber => ({
    ...subscriber,
    creator_id: user.id
  }))

  const { data, error } = await supabase
    .from('email_subscribers')
    .insert(subscribersWithCreatorId)
    .select()

  if (error) {
    console.error('Error importing subscribers:', error)
    throw new Error('Failed to import subscribers')
  }

  revalidatePath('/dashboard')
  return data
}
