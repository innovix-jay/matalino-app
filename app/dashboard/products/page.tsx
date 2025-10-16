'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputHTMLAttributes } from 'react'
import { createProduct, getProducts, updateProduct, deleteProduct } from '@/lib/actions/products'

type NewInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string }
function LabeledInput({ label, ...props }: NewInputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input {...props} className={`w-full px-3 py-2 border rounded-md ${props.className || ''}`} />
    </div>
  )
}

interface EditableProduct {
  id?: string
  name: string
  description?: string
  price: number
  product_type: 'digital_download' | 'course' | 'service' | 'membership'
  image_url?: string | null
  file_url?: string | null
  is_published: boolean
}

export default function ProductsDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<EditableProduct[]>([])
  const [form, setForm] = useState<EditableProduct>({
    name: '',
    description: '',
    price: 0,
    product_type: 'digital_download',
    image_url: '',
    file_url: '',
    is_published: false,
  })

  const refresh = async () => {
    setLoading(true)
    try {
      const list = await getProducts()
      setProducts(list as any)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const save = async () => {
    const payload = {
      name: form.name,
      description: form.description || null,
      price: Number(form.price || 0),
      product_type: form.product_type,
      image_url: form.image_url || null,
      file_url: form.file_url || null,
      is_published: form.is_published,
    }
    await createProduct(payload as any)
    setForm({ name: '', description: '', price: 0, product_type: 'digital_download', image_url: '', file_url: '', is_published: false })
    await refresh()
  }

  const remove = async (id: string) => {
    await deleteProduct(id)
    await refresh()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>Add a new product to your storefront</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <LabeledInput label="Price (USD)" type="number" step="0.01" value={form.price as any} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-md min-h-[96px]" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Product Type</label>
            <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value as any })} className="w-full px-3 py-2 border rounded-md">
              <option value="digital_download">Digital download</option>
              <option value="course">Course</option>
              <option value="service">Service</option>
              <option value="membership">Membership</option>
            </select>
          </div>
          <LabeledInput label="Image URL" value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <LabeledInput label="File URL (for downloads)" value={form.file_url || ''} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            <label htmlFor="published" className="text-sm">Published</label>
          </div>
          <div className="md:col-span-2">
            <Button onClick={save}>Save Product</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>Manage and publish products</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <div className="divide-y">
              {products.map((p: any) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.name} {p.is_published ? <span className="text-xs text-green-600 ml-2">Published</span> : null}</p>
                    <p className="text-sm text-muted-foreground">${Number(p.price).toFixed(2)} • {p.product_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a className="text-sm underline" href={`/store/${p.id}`} target="_blank" rel="noreferrer">View</a>
                    <Button variant="outline" onClick={() => remove(p.id)}>Delete</Button>
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



