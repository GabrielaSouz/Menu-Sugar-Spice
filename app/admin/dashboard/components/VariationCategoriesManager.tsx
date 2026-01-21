"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, X } from "lucide-react"

interface VariationCategory {
  name: string
  options: Array<{ label: string; price: string }>
}

interface VariationCategoriesManagerProps {
  variationCategories: VariationCategory[]
  onAddCategory: () => void
  onRemoveCategory: (index: number) => void
  onUpdateCategoryName: (index: number, name: string) => void
  onAddOption: (categoryIndex: number) => void
  onRemoveOption: (categoryIndex: number, optionIndex: number) => void
  onUpdateOption: (categoryIndex: number, optionIndex: number, field: "label" | "price", value: string) => void
}

export default function VariationCategoriesManager({
  variationCategories,
  onAddCategory,
  onRemoveCategory,
  onUpdateCategoryName,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}: VariationCategoriesManagerProps) {
  return (
    <div className="mt-6 border border-gray-200 bg-gray-50/50 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <Label className="font-semibold text-lg text-gray-700">Product Variations</Label>
        <Button
          type="button"
          onClick={onAddCategory}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Add Variation Category
        </Button>
      </div>

      {variationCategories.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          No variations added. Add variation categories like "Size", "Type", etc.
        </p>
      ) : (
        <div className="space-y-6">
          {variationCategories.map((category, catIndex) => (
            <div key={catIndex} className="border border-gray-300 rounded-lg p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    placeholder="Category Name (e.g., Size, Type)"
                    value={category.name}
                    onChange={(e) => onUpdateCategoryName(catIndex, e.target.value)}
                    className="font-medium border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCategory(catIndex)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Options:</Label>
                {category.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex gap-2 items-center">
                    <Input
                      placeholder="Option Name (e.g., Small, Medium)"
                      value={option.label}
                      onChange={(e) => onUpdateOption(catIndex, optIndex, "label", e.target.value)}
                      className="flex-1 border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]"
                      required
                    />
                    <div className="w-32">
                      <Input
                        placeholder="Price"
                        type="number"
                        min="0"
                        step="any"
                        value={option.price}
                        onChange={(e) => onUpdateOption(catIndex, optIndex, "price", e.target.value)}
                        className="border-gray-300 focus:border-[#8B4513] focus:ring-[#8B4513]"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveOption(catIndex, optIndex)}
                      disabled={category.options.length <= 1}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onAddOption(catIndex)}
                  className="mt-2 border-gray-300 hover:border-gray-400"
                >
                  Add Option
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
