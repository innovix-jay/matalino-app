import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single()

  if (!product) {
    return <div className="container mx-auto px-4 py-16"><p>Product not found.</p></div>
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground">{product.description}</p>
        <p className="text-2xl font-semibold">${Number(product.price).toFixed(2)}</p>
        <form action={`/api/checkout?productId=${product.id}`} method="post">
          <Button type="submit">Buy now</Button>
        </form>
        <div>
          <Link href="/">Back</Link>
        </div>
      </div>
    </div>
  )
}



