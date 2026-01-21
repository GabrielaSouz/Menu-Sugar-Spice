import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { EventProduct } from "@/types/event"

export interface SelectedVariation {
  categoryName: string
  option: {
    label: string
    price: number
  }
}

export interface CartItem {
  product: EventProduct
  quantity: number
  selectedVariations: SelectedVariation[]
  selectedType?: { label: string; price: number }
}

export const useCart = (reloadOnMount = false) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const loadCart = (): CartItem[] => {
    if (typeof window === "undefined") return []

    try {
      const storedCart = localStorage.getItem("cart")
      if (!storedCart) return []

      const parsedCart = JSON.parse(storedCart)
      return Array.isArray(parsedCart) ? parsedCart : []
    } catch (error) {
      console.error("useCart - error loading cart:", error)
      return []
    }
  }

  useEffect(() => {
    const storedCart = loadCart()
    if (storedCart.length > 0) {
      setCartItems(storedCart)
    } else {
      setCartItems([])
    }

    if (reloadOnMount) {
      // Listen for storage changes to update cart count
      const handleStorageChange = () => {
        const newCart = loadCart()
        setCartItems(newCart)
      }
      window.addEventListener("storage", handleStorageChange)
      window.addEventListener("cartUpdated", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("cartUpdated", handleStorageChange)
      }
    }
  }, [reloadOnMount])

  const updateVariation = (itemIndex: number, categoryName: string, option: { label: string; price: number }) => {
    const updatedCart = [...cartItems]
    const item = updatedCart[itemIndex]

    // Sistema antigo - Types
    if (categoryName === "type") {
      item.selectedType = option
    } 
    // Sistema novo - Variation Categories
    else {
      if (!Array.isArray(item.selectedVariations)) {
        item.selectedVariations = []
      }

      const existingVariationIndex = item.selectedVariations.findIndex((v) => v.categoryName === categoryName)

      if (existingVariationIndex >= 0) {
        item.selectedVariations[existingVariationIndex] = { categoryName, option }
      } else {
        item.selectedVariations.push({ categoryName, option })
      }
    }

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const updateQuantity = (itemIndex: number, quantity: number) => {
    if (quantity < 1) return
    const updatedCart = [...cartItems]
    updatedCart[itemIndex].quantity = quantity

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (itemIndex: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== itemIndex)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
    toast("Item removed from cart")
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return {
    cartItems,
    setCartItems,
    updateVariation,
    updateQuantity,
    removeItem,
    clearCart,
  }
}

export const useCartPricing = () => {
  const getItemPrice = (item: CartItem): number => {
    if (item.selectedVariations && item.selectedVariations.length > 0) {
      const variationsTotal = item.selectedVariations.reduce((total, variation) => {
        return total + (variation.option.price || 0)
      }, 0)
      return variationsTotal
    }

    if (item.selectedType?.price && item.selectedType.price > 0) {
      return item.selectedType.price
    }

    const basePrice = item.product.price || 0
    const hasPromotion =
      item.product.sale && item.product.sale > 0 && item.product.price && item.product.sale < item.product.price

    if (hasPromotion) {
      return item.product.sale || 0
    }

    return basePrice
  }

  const hasPromotion = (item: CartItem): boolean => {
    return !!(
      item.product.sale &&
      item.product.sale > 0 &&
      item.product.price &&
      item.product.sale < item.product.price &&
      !item.selectedType &&
      (!item.selectedVariations || item.selectedVariations.length === 0)
    )
  }

  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => {
      const price = getItemPrice(item)
      return total + price * item.quantity
    }, 0)
  }

  return {
    getItemPrice,
    hasPromotion,
    calculateTotal,
  }
}
