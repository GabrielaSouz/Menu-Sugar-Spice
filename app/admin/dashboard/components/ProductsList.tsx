"use client"

import ProductCard from "./ProductCard"

interface Event {
  id: string
  title: string
  description: string
  price?: number
  sale?: number
  image?: string
  category: string
  variation_categories?: Array<{
    name: string
    options: Array<{
      label: string
      price: number
    }>
  }>
  created_at?: string
}

interface ProductsListProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
}

export default function ProductsList({ events, onEdit, onDelete }: ProductsListProps) {
  // Organizar produtos por categoria
  const getProductsByCategory = () => {
    if (events.length === 0) return {}

    const groupedByCategory = events.reduce(
      (acc, product) => {
        const cat = product.category || "Uncategorized"
        if (!acc[cat]) {
          acc[cat] = []
        }
        acc[cat].push(product)
        return acc
      },
      {} as Record<string, Event[]>,
    )

    // Ordenar categorias alfabeticamente
    const sortedCategories = Object.keys(groupedByCategory).sort()
    const sortedGrouped: Record<string, Event[]> = {}

    sortedCategories.forEach((cat) => {
      // Dentro de cada categoria, ordenar por data de criação (mais recente primeiro)
      sortedGrouped[cat] = groupedByCategory[cat].sort((a: Event, b: Event) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return a.title.localeCompare(b.title)
      })
    })

    return sortedGrouped
  }

  const productsByCategory = getProductsByCategory()
  const categoryNames = Object.keys(productsByCategory)

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-gray-100 pb-3">Registered Products</h2>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No products registered yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first product using the form above</p>
        </div>
      ) : (
        <>
          {/* Informação de organização */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">
              📂 Products organized by category • {events.length} total products • {categoryNames.length} categories
            </p>
          </div>

          {/* Produtos organizados por categoria */}
          <div className="space-y-8">
            {categoryNames.map((categoryName) => (
              <div key={categoryName} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b-2 border-[#8B4513] pb-2 mb-4">
                  {categoryName}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({productsByCategory[categoryName].length} products)
                  </span>
                </h3>

                {/* Grid de produtos da categoria */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                  {productsByCategory[categoryName].map((event) => (
                    <ProductCard key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
