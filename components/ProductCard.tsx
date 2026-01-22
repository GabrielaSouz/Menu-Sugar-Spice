"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Scale } from "lucide-react"
import type { EventProduct } from "@/types/event"

interface ProductCardProps {
  product: EventProduct
  onAddToCart: (product: EventProduct) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const imageUrl =
    typeof product.image === "string" &&
      product.image.trim() !== "" &&
      (product.image.startsWith("http") || product.image.startsWith("https"))
      ? product.image
      : "/placeholder.svg"

  const hasPrice = product.price && product.price > 0
  const hasSale = product.sale && product.sale > 0
  const hasPromotion = hasPrice && hasSale && product.sale < product.price
  const displayPrice = hasPromotion ? product.sale : product.price

  const canAddToCart = true

  console.log("ProductCardHome - product:", {
    title: product.title,
    price: product.price,
    sale: product.sale,
    hasPrice,
    hasSale,
    hasPromotion,
    displayPrice,
  })

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-slate-100">
      {/* Image Section - Fixed Height */}
      <div className="relative h-56 overflow-hidden">
        {hasPromotion && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
            SALE
          </div>
        )}
        {!hasPrice && (
          <div
            className="absolute top-2 right-2 text-white px-2 py-1 rounded-md text-xs font-bold z-10 flex items-center gap-1 bg-rose-600"
           
          >
            <Scale className="h-3 w-3" />
            WEIGHT
          </div>
        )}
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={product.title}
          fill
          priority
          sizes="(max-width:500px) 100vw, (max-width:800px) 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Section - Flexible */}
      <div className="p-4 container mx-auto">

          <div className="flex flex-col mt-2">
            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">{product.title}</h3>
            <div className="flex flex-col">
              {!hasPrice ? (
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-rose-600 transition-colors" />
                  <p className="text-base font-semibold text-rose-600 transition-colors" >
                    Price by weight
                  </p>
                </div>
              ) : hasPromotion ? (
                <>
                  <p className="text-xl font-semibold text-rose-600">MYR {displayPrice.toFixed(2)}</p>
                  <p className="text-sm text-rose-600">MYR {product.price.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-xl font-semibold text-rose-600 transition-colors">MYR {displayPrice.toFixed(2)}</p>
              )}
            </div>

          </div>
          {/* Description - Fixed Height */}
          <p className="text-sm text-muted-foreground line-clamp-4 h-12 mt-2">{product.description}</p>
          {/* <p className="text-sm text-muted-foreground">{product.category}</p> */}
       

        {/* Button Section - Always at Bottom */}
        <div className="mt-auto pt-2">
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!canAddToCart}
            className={`w-full flex items-center gap-2 text-base text-slate-700 cursor-pointer ${!canAddToCart ? "bg-gray-400 cursor-not-allowed" : "bg-slate-100 hover:bg-rose-500 hover:text-white"
              }`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  )
}
