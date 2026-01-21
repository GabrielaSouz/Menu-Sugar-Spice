"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import DashboardHeader from "./components/DashboardHeader"
import ProductFormMain from "./components/ProductFormMain"
import ProductsList from "./components/ProductsList"
import DashboardPromotionForm from "./DashboardPromotionForm"

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

interface VariationCategory {
  name: string
  options: Array<{ label: string; price: string }>
}

// Categorias iniciais atualizadas
const initialCategories = ["Pasta", "Raviolli", "Sauces", "Gnocchi"]

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [formData, setFormData] = useState<any>({
    id: "",
    title: "",
    description: "",
    price: "",
    sale: "",
    image: null,
    category: "",
  })

  const [variationCategories, setVariationCategories] = useState<VariationCategory[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(false)

  const addNewCategory = () => {
    const newCat = newCategory.trim()
    if (newCat && !categories.includes(newCat)) {
      setCategories((prev) => [...prev, newCat])
      setFormData((prev: any) => ({ ...prev, category: newCat }))
      setNewCategory("")
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("Error loading products")
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleChange = (e: any) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    })
  }

  // Funções para gerenciar categorias de variações
  const addVariationCategory = () => {
    setVariationCategories((prev) => [
      ...prev,
      {
        name: "",
        options: [{ label: "", price: "0" }],
      },
    ])
  }

  const removeVariationCategory = (index: number) => {
    setVariationCategories((prev) => prev.filter((_, i) => i !== index))
  }

  const updateVariationCategoryName = (index: number, name: string) => {
    setVariationCategories((prev) => prev.map((cat, i) => (i === index ? { ...cat, name } : cat)))
  }

  const addOptionToCategory = (categoryIndex: number) => {
    setVariationCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex ? { ...cat, options: [...cat.options, { label: "", price: "0" }] } : cat,
      ),
    )
  }

  const removeOptionFromCategory = (categoryIndex: number, optionIndex: number) => {
    setVariationCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex ? { ...cat, options: cat.options.filter((_, j) => j !== optionIndex) } : cat,
      ),
    )
  }

  const updateOption = (categoryIndex: number, optionIndex: number, field: "label" | "price", value: string) => {
    setVariationCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              options: cat.options.map((opt, j) => (j === optionIndex ? { ...opt, [field]: value } : opt)),
            }
          : cat,
      ),
    )
  }

 const resetForm = () => {
  setFormData({
    id: "",
    title: "",
    description: "",
    price: "",
    sale: "",
    image: null,
    category: "",
  })
  setVariationCategories([])
  setIsEditing(false)
}

  const handleSubmit = async (e: any) => {
  e.preventDefault()
  setLoading(true)

  try {
    const method = isEditing ? "PUT" : "POST"
    const body = new FormData()

    body.append("title", formData.title)
    body.append("description", formData.description)
    body.append("category", formData.category)

    if (formData.price) body.append("price", formData.price)
    if (formData.image) body.append("image", formData.image)

    const validVariationCategories = variationCategories
      .filter(cat => cat.name.trim())
      .map(cat => ({
        name: cat.name,
        options: cat.options
          .filter(opt => opt.label.trim())
          .map(opt => ({
            label: opt.label,
            price: Number(opt.price),
          })),
      }))
      .filter(cat => cat.options.length > 0)

    if (validVariationCategories.length > 0) {
      body.append(
        "variationCategories",
        JSON.stringify(validVariationCategories)
      )
    }

    const url = isEditing
      ? `/api/events/${formData.id}`
      : "/api/events"

    const res = await fetch(url, {
      method,
      body,
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    fetchEvents()
    resetForm()
    toast.success(
      isEditing ? "Product updated successfully!" : "Product created successfully!"
    )
  } catch (err) {
    console.error(err)
    toast.error("Error saving product")
  } finally {
    setLoading(false)
  }
}


const handleEdit = (event: Event) => {
  setFormData({
    id: event.id,
    title: event.title,
    description: event.description,
    price: event.price ?? "",
    sale: event.sale ?? "",
    image: null,
    category: event.category,
  })

  if (event.variation_categories) {
    setVariationCategories(
      event.variation_categories.map(cat => ({
        name: cat.name,
        options: cat.options.map(opt => ({
          label: opt.label,
          price: String(opt.price),
        })),
      }))
    )
  } else {
    setVariationCategories([])
  }

  setIsEditing(true)
  window.scrollTo(0, 0)
}


 const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return

  const res = await fetch(`/api/events/${id}`, {
    method: "DELETE",
  })

  if (res.ok) {
    fetchEvents()
    toast.success("Product deleted successfully!")
  } else {
    toast.error("Error deleting product")
  }
}

  const handleCategoryChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, category: value }))
  }

  return (
    <>
      <DashboardHeader />

      {/* Container com melhor espaçamento para notebooks */}
      <div className="px-6 md:px-12 lg:px-16 xl:px-20 2xl:px-12 py-8 space-y-8 flex flex-col justify-center items-center bg-gray-50 min-h-screen">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductFormMain
            formData={formData}
            variationCategories={variationCategories}
            isEditing={isEditing}
            categorias={categories}
            novaCategoria={newCategory}
            setNovaCategoria={setNewCategory}
            loading={loading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onCategoryChange={handleCategoryChange}
            onAddCategory={addNewCategory}
            onAddVariationCategory={addVariationCategory}
            onRemoveVariationCategory={removeVariationCategory}
            onUpdateVariationCategoryName={updateVariationCategoryName}
            onAddOptionToCategory={addOptionToCategory}
            onRemoveOptionFromCategory={removeOptionFromCategory}
            onUpdateOption={updateOption}
            onReset={resetForm}
          />

          <div className="w-full">
            <DashboardPromotionForm />
          </div>
        </div>

        <ProductsList events={events} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </>
  )
}
