"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import type { EventProduct } from "@/types/event"

interface ProductListProps {
  products: EventProduct[]
  onAddToCart: (product: EventProduct) => void
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
  const [events, setEvents] = useState<EventProduct[]>([])
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [category, setCategory] = useState("All Products")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar produtos
  const fetchEvents = async () => {
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

      if (Array.isArray(data)) {
        setEvents(data)
        // Extrair categorias dos produtos
        const uniqueCategories = ["All Products", ...new Set(data.map((e: EventProduct) => e.category).filter(Boolean))]
        setCategories(uniqueCategories)
      } else {
        console.error("API response is not a list:", data)
        setEvents([])
      }
    } catch (err) {
      console.error("Error fetching events:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch products")
      setEvents([])
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      await fetchEvents()
      setLoading(false)
    }
    loadData()
  }, [])

  // Atualizar quando há mudanças externas (ex: novo produto criado)
  useEffect(() => {
    if (products && products.length > 0) {
      fetchEvents()
    }
  }, [products])

  // Função para organizar produtos
  const getFilteredAndSortedEvents = () => {
    let filteredEvents: EventProduct[]

    if (category === "All Products") {
      filteredEvents = events
    } else {
      filteredEvents = events.filter((e) => e.category === category)
    }

    // Se "All Products" está selecionado, organizar por categoria
    if (category === "All Products") {
      // Primeiro, agrupar por categoria
      const groupedByCategory = filteredEvents.reduce(
        (acc, product) => {
          const cat = product.category || "Uncategorized"
          if (!acc[cat]) {
            acc[cat] = []
          }
          acc[cat].push(product)
          return acc
        },
        {} as Record<string, EventProduct[]>,
      )

      // Depois, ordenar as categorias alfabeticamente e concatenar os produtos
      const sortedCategories = Object.keys(groupedByCategory).sort()
      const sortedProducts: EventProduct[] = []

      sortedCategories.forEach((cat) => {
        // Dentro de cada categoria, ordenar por título (alfabética) como fallback
        const categoryProducts = groupedByCategory[cat].sort((a, b) => {
          // Tentar ordenar por createdAt se existir, senão por título
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return a.title.localeCompare(b.title)
        })
        sortedProducts.push(...categoryProducts)
      })

      return sortedProducts
    }

    // Para categoria específica, ordenar por título
    return filteredEvents.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.title.localeCompare(b.title)
    })
  }

  const filteredEvents = getFilteredAndSortedEvents()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Products</h3>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchEvents().finally(() => setLoading(false))
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id="products" className="scroll-mt-20">
      {/* Category Filter */}
      <div className="hidden md:flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-200 ${
              cat === category
                ? "bg-rose-500 text-white font-medium shadow-lg shadow-rose-100"
                : "bg-white text-slate-500 hover:text-rose-500 hover:bg-rose-50 border border-slate-100"
            }`}
          >
            {cat}
            {cat === "All Products" && <span className="ml-1 text-xs opacity-75">({events.length})</span>}
            {cat !== "All Products" && (
              <span className="ml-1 text-xs opacity-75">({events.filter((e) => e.category === cat).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {category === "All Products" ? "No products available" : `No products in "${category}" category`}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {category === "All Products" ? "Add some products in the dashboard" : "Try selecting a different category"}
          </p>
        </div>
      ) : (
        <>
          {/* Mostrar organização quando "All Products" estiver selecionado */}
          {category === "All Products" && filteredEvents.length > 0 && (
            <div className="mb-8 text-center">
              {/* <p className="text-sm text-gray-600">
                📂 Products organized by category • {filteredEvents.length} total products
              </p> */}
            </div>
          )}

          <div className="space-y-12">
            {category === "All Products" ? (
              // Layout normal para todos os produtos juntos
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-fr">
                {filteredEvents.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
              </div>
            ) : (
              // Layout normal para categoria específica
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-fr">
                {filteredEvents.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
