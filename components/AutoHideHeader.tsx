"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import SideCart from "./SideCart"

export default function AutoHideHeader() {
  const [cartCount, setCartCount] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false);

  const router = useRouter()
  const pathname = usePathname()
  const isCartPage = pathname === "/cart"

  const toggleCart = () => {
    if (!isCartPage) {
      setIsCartOpen(!isCartOpen);
    }
  }

  useEffect(() => {

    const updateCartCount = () => {
      const cart = localStorage.getItem("cart")
      if (cart) {
        const cartItems = JSON.parse(cart)
        const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } else {
        setCartCount(0)
      }
    }


    updateCartCount()

    // Listen for storage changes to update cart count
    window.addEventListener("storage", updateCartCount)
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {

      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)

    }
  }, [])

  return (
    <>
        <header className="fixed top-0 left-0 right-0 z-40 w-full glass-card border-b border-rose-100 px-4 md:px-8 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between ">

            {/* Logo/Back Button */}
            <div className="flex items-center">
              {isCartPage ? (
                <Button
                  variant="ghost"
                  className="text-[#8b4513]/90 hover:text-[#daa077]  hover:bg-white/10 flex items-center gap-2 cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Products
                </Button>
              ) : (
                <Link href="/" className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg shadow-rose-200">
                      <Sparkles size={20} />
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-rose-900">
                      Sugar <span className="text-amber-600">&</span> Spice
                    </h1>
                  </div>
                </Link>
              )}
            </div>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="font-medium text-[#8b4513]/90 hover:text-[#daa077] transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/#products"
                className="font-medium text-[#8b4513]/90 hover:text-[#daa077] transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                href="/#footer"
                className="font-medium  text-[#8b4513]/90 hover:text-[#daa077] transition-colors duration-200"
              >
                Contact us
              </Link>
            </nav>

            {/* Cart Button */}

            <Button
              onClick={toggleCart}
              variant="secondary"
              size="sm"
              className="relative bg-rose-500 text-slate-100 border-[#8b4513]/30 hover:bg-rose-500/40 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ">
                  {cartCount}
                </span>
              )}
            </Button>

          </div>
        </div>
      </header>
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
