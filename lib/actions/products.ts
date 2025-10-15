'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Product {
  id: string
  creator_id: string
  name: string
  description: string | null
  price: number
  product_type: 'digital_download' | 'course' | 'service' | 'membership'
  image_url: string | null
  file_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }

  return data || []
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function createProduct(productData: Omit<Product, 'id' | 'creator_id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...productData,
      creator_id: user.id
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw new Error('Failed to create product')
  }

  revalidatePath('/dashboard')
  return data
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw new Error('Failed to update product')
  }

  revalidatePath('/dashboard')
  return data
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw new Error('Failed to delete product')
  }

  revalidatePath('/dashboard')
}

export async function getProductsCount(): Promise<number> {
  const supabase = await createClient()
  
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting products:', error)
    return 0
  }

  return count || 0
}
