import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@tofu-ray/core'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.handle}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm leading-tight">{product.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="font-bold">{formatPrice(product.price, product.currency)}</span>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
