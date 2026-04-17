import type { Product } from './types'

export const mockProducts: Product[] = [
  {
    id: '1',
    handle: 'classic-white-tee',
    title: 'Classic White Tee',
    description:
      'A timeless classic white t-shirt made from 100% organic cotton. Comfortable, breathable, and perfect for any occasion. The relaxed fit makes it suitable for layering or wearing on its own.',
    price: 29000,
    currency: 'KRW',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    ],
    category: 'Tops',
    tags: ['cotton', 'basic', 'unisex'],
    inStock: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    handle: 'slim-fit-jeans',
    title: 'Slim Fit Jeans',
    description:
      'Premium slim-fit jeans crafted from high-quality denim. Features a classic five-pocket design with a modern slim silhouette. Available in a versatile mid-blue wash.',
    price: 89000,
    currency: 'KRW',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
    ],
    category: 'Bottoms',
    tags: ['denim', 'slim', 'casual'],
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    handle: 'oversized-hoodie',
    title: 'Oversized Hoodie',
    description:
      'Ultra-cozy oversized hoodie for the ultimate comfort experience. Made from a premium fleece blend, it features a kangaroo pocket, adjustable drawstring, and dropped shoulders for that relaxed look.',
    price: 65000,
    currency: 'KRW',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=800&q=80',
    ],
    category: 'Tops',
    tags: ['hoodie', 'oversized', 'comfort'],
    inStock: true,
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: '4',
    handle: 'linen-blazer',
    title: 'Linen Blazer',
    description:
      'A sophisticated linen blazer that transitions effortlessly from office to evening. The breathable fabric keeps you comfortable while the structured silhouette ensures a polished appearance.',
    price: 145000,
    currency: 'KRW',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    ],
    category: 'Outerwear',
    tags: ['linen', 'blazer', 'smart'],
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: '5',
    handle: 'cargo-pants',
    title: 'Cargo Pants',
    description:
      'Functional cargo pants with multiple pockets designed for everyday utility. Made from a durable cotton-blend fabric with a relaxed fit and tapered leg. Perfect for casual outings.',
    price: 75000,
    currency: 'KRW',
    images: [
      'https://images.unsplash.com/photo-1608228088998-57828365d486?w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    ],
    category: 'Bottoms',
    tags: ['cargo', 'utility', 'casual'],
    inStock: false,
    rating: 4.5,
    reviewCount: 41,
  },
  {
    id: '6',
    handle: 'knit-sweater',
    title: 'Knit Sweater',
    description:
      'A beautifully crafted ribbed knit sweater made from a soft wool blend. The crew neck and relaxed fit make it an easy layer for cooler months. Available in several muted tones.',
    price: 95000,
    currency: 'KRW',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    ],
    category: 'Tops',
    tags: ['knit', 'wool', 'winter'],
    inStock: true,
    rating: 4.7,
    reviewCount: 78,
  },
]

export function getProductByHandle(handle: string): Product | undefined {
  return mockProducts.find((p) => p.handle === handle)
}
