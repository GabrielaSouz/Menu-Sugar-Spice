"use client"

import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"

interface ProductCardProps {
  event: any
  onEdit: (event: any) => void
  onDelete: (id: string) => void
}

export default function ProductCard({ event, onEdit, onDelete }: ProductCardProps) {
  const hasPrice = typeof event.price === "number" && event.price > 0
  const hasSale = typeof event.sale === "number" && event.sale > 0
  const hasPromotion = hasPrice && hasSale && event.sale < event.price

  // 🔥 USAR O NOME CORRETO DO SUPABASE
  const hasVariations =
    Array.isArray(event.variation_categories) &&
    event.variation_categories.length > 0

  const hasTypes = Array.isArray(event.types) && event.types.length > 0

  return (
    <div className="border border-gray-200 rounded-xl bg-white flex flex-col h-full">
      {/* IMAGE */}
      <div className="relative overflow-hidden rounded-t-xl">
        {hasPromotion && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            SALE
          </div>
        )}

        {/* 🚫 WEIGHT SÓ SE NÃO EXISTIR A COLUNA */}
        {!hasPrice && !hasVariations && !hasTypes && (
          <div
            className="absolute top-2 right-2 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1"
            style={{ backgroundColor: "#8B4513" }}
          >
            <Scale className="h-3 w-3" />
            WEIGHT
          </div>
        )}

        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold mb-2">{event.title}</h3>
          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
            {event.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

        {/* PRICE */}
        <div className="mb-2">
          {hasPromotion && (
            <>
              <p className="text-red-500 font-semibold">
                MYR {event.sale.toFixed(2)}
              </p>
              <p className="text-xs line-through text-gray-400">
                MYR {event.price.toFixed(2)}
              </p>
            </>
          )}

          {!hasPromotion && hasPrice && (
            <p className="text-emerald-600 font-semibold">
              MYR {event.price.toFixed(2)}
            </p>
          )}

          {!hasPromotion && !hasPrice && hasVariations && (
            <div className="space-y-2">
              {event.variation_categories.map((category: any, index: number) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1"
                >
                  <p className="text-xs font-semibold text-blue-700">
                    {category.name}
                  </p>

                  <ul className="mt-1 space-y-0.5">
                    {category.options.map((option: any, i: number) => (
                      <li
                        key={i}
                        className="flex justify-between text-xs text-blue-800"
                      >
                        <span>{option.label}</span>
                        <span className="font-medium">
                          MYR {option.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {!hasPromotion && !hasPrice && !hasVariations && !hasTypes && (
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#8B4513]" />
              <span className="font-semibold text-[#8B4513]">
                Price by weight
              </span>
            </div>
          )}
        </div>


        {/* ACTIONS */}
        <div className="mt-auto pt-2 flex gap-2">
          <Button size="sm" onClick={() => onEdit(event)} className="flex-1">
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(event.id)}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
