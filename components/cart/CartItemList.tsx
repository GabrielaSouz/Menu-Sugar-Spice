import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart, useCartPricing, type CartItem } from "@/hooks/useCart"

interface CartItemListProps {
  cartItems: CartItem[]
  onUpdateVariation: (itemIndex: number, categoryName: string, option: { label: string; price: number }) => void
  onUpdateQuantity: (itemIndex: number, quantity: number) => void
  onRemoveItem: (itemIndex: number) => void
}

export default function CartItemList({ cartItems, onUpdateVariation, onUpdateQuantity, onRemoveItem }: CartItemListProps) {
  const { getItemPrice, hasPromotion } = useCartPricing()

  // Mapear dados do Supabase (snake_case) para o tipo EventProduct (camelCase)
  const normalizedCartItems = cartItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      variationCategories: (item.product as any).variation_categories || (item.product as any).variationCategories,
      types: (item.product as any).types
    }
  }))

  return (
    <div className="space-y-4">
      {normalizedCartItems.map((item, itemIndex) => {
        const price = getItemPrice(item)
        const itemHasPromotion = hasPromotion(item)

        return (
          <Card key={itemIndex} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Imagem */}
                <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0">
                  {itemHasPromotion && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold z-10">
                      PROMO
                    </div>
                  )}
                  {item.product?.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Dados do produto */}
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg mb-2">{item.product.title}</h3>
                    <p className="ml-auto font-medium text-gray-500 text-base">  MYR {(price).toFixed(2)}</p>
                  </div>
                  {/* Variations */}
                  {Array.isArray(item.product.variationCategories) &&
                    item.product.variationCategories.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {item.product.variationCategories.map((category, catIndex) => (
                          <div key={catIndex}>
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              {category.name}:
                            </p>

                            <div className="grid grid-cols-2 gap-1">
                              {category.options.map((option: { label: string; price: number }, optIndex: number) => {
                                const isSelected = item.selectedVariations?.some(
                                  (v) =>
                                    v.categoryName === category.name &&
                                    v.option.label === option.label
                                )

                                return (
                                  <button
                                    key={optIndex}
                                    type="button"
                                    onClick={() =>
                                      onUpdateVariation(itemIndex, category.name, option)
                                    }
                                    className={`px-2 py-1 border rounded-md text-xs font-medium transition-all ${isSelected
                                      ? "bg-rose-500 text-white border-rose-300"
                                      : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                                      }`}
                                  >
                                    {option.label}
                                    <span className="ml-1 text-[10px] opacity-80">
                                      (MYR {option.price})
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}


                  {/* Exibir tipo selecionado (sistema antigo) */}
                  {item.selectedType && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Selected type:</p>
                      <div className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <span className="font-medium">Type:</span>{" "}
                        {item.selectedType.label} - MYR {item.selectedType.price.toFixed(2)}
                      </div>
                    </div>
                  )}


                  <div className="mb-3 flex justify-between items-center">


                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(itemIndex, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-medium transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(itemIndex, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>


                    {itemHasPromotion ? (
                      <div className="space-y-1">
                        <p className="text-red-500 font-semibold text-sm">
                          <span className="text-gray-500 text-xs font-normal">Sale: </span>
                          MYR {price.toFixed(2)}
                        </p>
                        <p className="text-xs line-through text-gray-400">
                          <span className="font-normal">Original: </span>
                          MYR {item.product.price?.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-emerald-600 font-semibold text-sm">
                        MYR {(price * item.quantity).toFixed(2)}
                      </p>
                    )}
                    {/* <p className="text-xs text-gray-500 mt-1">
                      {item.quantity > 1 && `× ${item.quantity} = MYR ${(price * item.quantity).toFixed(2)}`}
                      {item.quantity === 1 && "Unit price"}
                    </p> */}


                    <button
                      onClick={() => onRemoveItem(itemIndex)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>


                </div>

              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
