"use client"

import { Button } from "@/components/ui/button"
import { Trash2, X, Plus, Minus, ShoppingCart } from "lucide-react"
import { useCart, useCartPricing } from "@/hooks/useCart"
import { Key } from "react"

interface SideCartProps {
  isOpen: boolean
  onClose: () => void
}



export default function SideCart({ isOpen, onClose }: SideCartProps) {
  const { cartItems, updateVariation, updateQuantity, removeItem } = useCart(true)
  const { getItemPrice, hasPromotion, calculateTotal } = useCartPricing()

  // Mapear dados do Supabase (snake_case) para o tipo EventProduct (camelCase)
  const normalizedCartItems = cartItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      variationCategories: (item.product as any).variation_categories || (item.product as any).variationCategories,
      types: (item.product as any).types
    }
  }))

  const goToCheckout = () => {
    window.location.href = "/cart"
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Side Cart */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {normalizedCartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some delicious items!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {normalizedCartItems.map((item, itemIndex) => {
                  const price = getItemPrice(item)
                  const itemHasPromotion = hasPromotion(item)

                  return (
                    <div key={itemIndex} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">{item.product.title}</h3>

                        {/* Variations */}
                        {Array.isArray(item.product.variationCategories) &&
                          item.product.variationCategories.length > 0 && (
                            <div className="space-y-2 mb-2">
                              {item.product.variationCategories.map((category, catIndex) => (
                                <div key={catIndex}>
                                  <p className="text-xs font-semibold text-gray-700 mb-1">
                                    {category.name}:
                                  </p>

                                  <div className="grid grid-cols-2 gap-1">
                                    {category.options.map((option: { label: any; price: any }, optIndex: Key | null | undefined) => {
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
                                            updateVariation(itemIndex, category.name, option)
                                          }
                                          className={`px-2 py-1 border rounded text-xs font-medium transition-all ${isSelected
                                              ? "bg-slate-700 text-white border-slate-700 cursor-pointer"
                                              : "bg-gray-50 hover:bg-gray-100 border-gray-300 cursor-pointer"
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

                        {/* Price */}
                        <div className="mb-2">
                          {itemHasPromotion ? (
                            <div className="space-y-1">
                              <p className="text-red-500 font-semibold text-sm">
                                MYR {price.toFixed(2)}
                              </p>
                              <p className="text-xs line-through text-gray-400">
                                MYR {item.product.price?.toFixed(2)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-rose-600 font-semibold text-sm">
                              MYR {price.toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(itemIndex, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center text-xs font-medium transition-colors"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(itemIndex, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 flex items-center justify-center text-xs font-medium transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(itemIndex)}
                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {normalizedCartItems.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>MYR {calculateTotal(normalizedCartItems).toFixed(2)}</span>
              </div>
              <Button
                onClick={goToCheckout}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all duration-200"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
