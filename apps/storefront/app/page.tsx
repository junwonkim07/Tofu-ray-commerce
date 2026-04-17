import Link from 'next/link'
import { mockProducts } from '@tofu-ray/core'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react'

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-24 overflow-hidden">
        <div className="container flex flex-col items-center text-center gap-6">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            New Collection 2024
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Minimal Design,{' '}
            <span className="text-primary">Maximum Style</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Discover our curated collection of premium basics designed for everyday living.
            Quality craftsmanship meets modern aesthetics.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over ₩50,000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">Your data is always protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">Hand-picked favorites from our collection</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">New Season Arrivals</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
            Explore our latest collection featuring seasonal essentials and exclusive drops.
          </p>
          <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
            <Link href="/products">Explore Collection</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
