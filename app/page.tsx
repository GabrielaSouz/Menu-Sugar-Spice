"use client"
import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import ProductList from "@/components/ProductList"
import PromotionBanner from "@/components/PromotionBanner"
import { Hero } from "@/components/Hero/Hero"
import AutoHideHeader from "@/components/AutoHideHeader"
import Footer from "@/components/Footer"
import type { EventProduct } from "@/types/event"
import { Search, ChevronDown } from "lucide-react"

interface CartItem {
  product: EventProduct
  quantity: number
  selectedType?: { label: string; price: number }
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Products")
  const [products, setProducts] = useState<EventProduct[]>([])
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [loading, setLoading] = useState(true)

  // Buscar produtos da API (mesma lógica do ProductList)
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/events")
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await res.json()
      
      console.log("API Response - first 3 products:", data.slice(0, 3).map((p: EventProduct) => ({
        title: p.title,
        price: p.price,
        sale: p.sale,
        types: p.types,
        variationCategories: p.variationCategories
      })))
      
      if (Array.isArray(data)) {
        console.log('Produtos recebidos da API:', data.length)
        setProducts(data)
        // Extrair categorias dos produtos (mesma lógica do ProductList)
        const uniqueCategories = ["All Products", ...new Set(data.map((e: EventProduct) => e.category).filter(Boolean))]
        setCategories(uniqueCategories)
        console.log('Categorias extraídas:', uniqueCategories)
      } else {
        console.error("API response is not a list:", data)
        setProducts([])
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchProducts()
  }, [])

  // Filtra produtos baseado na busca e categoria
  const filteredProducts = useMemo(() => {
    // Se não há busca, filtra apenas por categoria
    if (!searchQuery.trim()) {
      return products.filter(product => {
        const matchesCategory = activeCategory === "All Products" || product.category === activeCategory
        return matchesCategory
      })
    }
    
    const searchLower = searchQuery.toLowerCase().trim()
    
    return products.filter(product => {
      // Busca case insensitive em título, descrição e categoria
      const productTitle = product.title.toLowerCase()
      const productDesc = product.description.toLowerCase()
      const productCategory = product.category.toLowerCase()
      
      // Busca exata ou parcial
      const exactMatch = productTitle.includes(searchLower) ||
                           productDesc.includes(searchLower) ||
                           productCategory.includes(searchLower)
      
      // Busca por similaridade (fuzzy search)
      const searchWords = searchLower.split(' ')
      const titleWords = productTitle.split(' ')
      const descWords = productDesc.split(' ')
      const categoryWords = productCategory.split(' ')
      
      const hasPartialMatch = searchWords.some(searchWord => 
        titleWords.some(titleWord => titleWord.includes(searchWord)) ||
        descWords.some(descWord => descWord.includes(searchWord)) ||
        categoryWords.some(categoryWord => categoryWord.includes(searchWord))
      )
      
      const matchesSearch = exactMatch || hasPartialMatch
      
      const matchesCategory = activeCategory === "All Products" || product.category === activeCategory
      
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, activeCategory])
  
  const addToCart = (product: EventProduct) => {
    const existingCart = localStorage.getItem("cart")
    const cart: CartItem[] = existingCart ? JSON.parse(existingCart) : []

    const existingItem = cart.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch custom event to update header cart count
    window.dispatchEvent(new Event("cartUpdated"))

    toast.success(`${product.title} added to cart!`)
  }

  return (
    <div className="min-h-screen">
      <AutoHideHeader />
      <Hero />
      <PromotionBanner />

      {/* Products Section with improved spacing */}
      <section className="bg-stone-50 pt-24 pb-12 md:pb-16 lg:pb-20" id="products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-rose-500 rounded-full" />
              Explore the Menu
            </h2>
            <p className="text-slate-500">Freshly baked every single morning.</p>
          </div>
          {/* <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all w-full sm:w-64"
              />
            </div>
            <div className="relative inline-block text-left">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="appearance-none bg-white border border-slate-200 px-6 pr-12 py-3 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-400 transition-all cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div> */}
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
            </div>
          ) : (
            <ProductList products={filteredProducts} onAddToCart={addToCart} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
