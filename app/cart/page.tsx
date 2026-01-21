"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AutoHideHeader from "@/components/AutoHideHeader"
import Footer from "@/components/Footer"
import CartItemList from "@/components/cart/CartItemList"
import OrderSummary from "@/components/cart/OrderSummary"
import { useCart } from "@/hooks/useCart"
import { useWhatsAppOrder } from "@/hooks/useWhatsAppOrder"

export default function CartPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const router = useRouter()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  
  const { cartItems, updateVariation, updateQuantity, removeItem, clearCart } = useCart(true) // Forçar reload na página do carrinho
  const { sendToWhatsApp } = useWhatsAppOrder()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    sendToWhatsApp({
      cartItems,
      name,
      phone,
      whatsappNumber,
      onSuccess: clearCart
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AutoHideHeader />

      {/* Cart Content with improved spacing */}
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-24 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
            <Button onClick={() => router.push("/")} className="bg-[#8B4513] hover:bg-[#7a3a00]">
              View products
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Produtos no carrinho */}
            <div className="lg:col-span-2">
              <CartItemList
                cartItems={cartItems}
                onUpdateVariation={updateVariation}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                name={name}
                phone={phone}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
