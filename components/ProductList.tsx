"use client"

import { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import type { EventProduct } from "@/types/event"
import { useProducts } from "@/hooks/useProducts"
import { ChevronDown } from "lucide-react"

interface ProductListProps {
  onAddToCart: (product: EventProduct) => void
}

export default function ProductList({ onAddToCart }: ProductListProps) {
  const [category, setCategory] = useState("Todos")
  const { products: events, loading, error, usingMock, refetch } = useProducts()
  const [categories, setCategories] = useState<string[]>(["Todos"])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Atualizar categorias quando os produtos mudam
  useEffect(() => {
    if (events.length > 0) {
      const uniqueCategories = ["Todos", ...new Set(events.map((e) => e.category).filter(Boolean))]
      setCategories(uniqueCategories)
    }
  }, [events])

  // Função para organizar produtos
  const getFilteredAndSortedEvents = () => {
    let filteredEvents: EventProduct[] = events as EventProduct[]

    if (category === "Todos") {
      filteredEvents = events as EventProduct[]
    } else {
      filteredEvents = (events as EventProduct[]).filter((e) => e.category === category)
    }

    // Se "Todos" está selecionado, organizar por categoria
    if (category === "Todos") {
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
            onClick={() => refetch()}
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
      {/* Category Filter - Mobile Dropdown */}
      <div className="md:hidden mb-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-rose-300 transition-colors"
          >
            <span className="font-medium text-slate-700">
              {category}
              <span className="ml-2 text-xs text-slate-500">
                ({category === "Todos" ? events.length : events.filter((e) => e.category === category).length})
              </span>
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                    cat === category
                      ? "bg-rose-50 text-rose-600 font-medium"
                      : "text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-xs text-slate-500">
                      ({cat === "Todos" ? events.length : events.filter((e) => e.category === cat).length})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter - Desktop Buttons */}
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
            {cat === "Todos" && <span className="ml-1 text-xs opacity-75">({events.length})</span>}
            {cat !== "Todos" && (
              <span className="ml-1 text-xs opacity-75">({events.filter((e) => e.category === cat).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {category === "Todos" ? "No products available" : `No products in "${category}" category`}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {category === "Todos" ? "Add some products in the dashboard" : "Try selecting a different category"}
          </p>
        </div>
      ) : (
        <>
          {/* Mostrar organização quando "Todos" estiver selecionado */}
          {category === "Todos" && filteredEvents.length > 0 && (
            <div className="mb-8 text-center">
              {/* <p className="text-sm text-gray-600">
                📂 Products organized by category • {filteredEvents.length} total products
              </p> */}
            </div>
          )}

          <div className="space-y-12">
            {category === "Todos" ? (
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
