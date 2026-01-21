"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Percent, X } from "lucide-react"
import CategoryManager from "./CategoryManager"
import VariationCategoriesManager from "./VariationCategoriesManager"

interface VariationCategory {
  name: string
  options: Array<{ label: string; price: string }>
}

interface ProductFormMainProps {
  formData: any
  variationCategories: VariationCategory[]
  isEditing: boolean
  categorias: string[]
  novaCategoria: string
  setNovaCategoria: (value: string) => void
  loading: boolean
  onSubmit: (e: any) => void
  onChange: (e: any) => void
  onCategoryChange: (value: string) => void
  onAddCategory: () => void
  onAddVariationCategory: () => void
  onRemoveVariationCategory: (index: number) => void
  onUpdateVariationCategoryName: (index: number, name: string) => void
  onAddOptionToCategory: (categoryIndex: number) => void
  onRemoveOptionFromCategory: (categoryIndex: number, optionIndex: number) => void
  onUpdateOption: (categoryIndex: number, optionIndex: number, field: "label" | "price", value: string) => void
  onReset: () => void
}

export default function ProductFormMain({
  formData,
  variationCategories,
  isEditing,
  categorias,
  novaCategoria,
  setNovaCategoria,
  loading,
  onSubmit,
  onChange,
  onCategoryChange,
  onAddCategory,
  onAddVariationCategory,
  onRemoveVariationCategory,
  onUpdateVariationCategoryName,
  onAddOptionToCategory,
  onRemoveOptionFromCategory,
  onUpdateOption,
  onReset,
}: ProductFormMainProps) {
  const [showPromotionalPrice, setShowPromotionalPrice] = useState(
    isEditing && formData.sale && Number(formData.sale) > 0,
  )

  const handlePromotionalToggle = () => {
    setShowPromotionalPrice(!showPromotionalPrice)
    if (showPromotionalPrice) {
      onChange({ target: { name: "sale", value: "" } })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full h-fit lg:h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">
        {isEditing ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={onChange}
          required
          className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513] h-12 text-base"
        />

        <Textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={onChange}
          required
          className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513] min-h-[100px] text-base"
        />

        <div className="space-y-2">
          <Input
            name="price"
            type="number"
            placeholder="Base Price (leave empty if using only variations)"
            value={formData.price}
            onChange={onChange}
            step="0.01"
            min="0"
            className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513] h-12 text-base"
          />
          <p className="text-sm text-gray-500">💡 Leave empty if the product price is determined only by variations</p>
        </div>

        {!showPromotionalPrice && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePromotionalToggle}
            className="flex items-center gap-2 border-orange-200 text-orange-600 hover:border-orange-300 hover:bg-orange-50"
          >
            <Percent className="h-4 w-4" />
            Add Sale Price
          </Button>
        )}

        {showPromotionalPrice && (
          <div className="space-y-2 p-4 border border-orange-200 rounded-lg bg-orange-50/50">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
                <Percent className="h-3 w-3" />
                Sale Price
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePromotionalToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              name="sale"
              type="number"
              placeholder="Sale price"
              value={formData.sale || ""}
              onChange={onChange}
              step="0.01"
              min="0"
              className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 h-12 text-base"
            />
            <p className="text-sm text-orange-600">⚠️ Sale price must be lower than regular price</p>
          </div>
        )}

        <CategoryManager
          categorias={categorias}
          formDataCategory={formData.category}
          novaCategoria={novaCategoria}
          setNovaCategoria={setNovaCategoria}
          onCategoryChange={onCategoryChange}
          onAddCategory={onAddCategory}
        />

        <Input name="image" type="file" accept="image/*" onChange={onChange} required={!isEditing} />

        <VariationCategoriesManager
          variationCategories={variationCategories}
          onAddCategory={onAddVariationCategory}
          onRemoveCategory={onRemoveVariationCategory}
          onUpdateCategoryName={onUpdateVariationCategoryName}
          onAddOption={onAddOptionToCategory}
          onRemoveOption={onRemoveOptionFromCategory}
          onUpdateOption={onUpdateOption}
        />

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#8B4513] hover:bg-[#7a3a00] text-white font-semibold px-8 py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-semibold px-8 py-3 transition-all duration-200"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
