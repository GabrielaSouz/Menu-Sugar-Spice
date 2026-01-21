"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface CategoryManagerProps {
  categorias: string[]
  formDataCategory: string
  novaCategoria: string
  setNovaCategoria: (value: string) => void
  onCategoryChange: (value: string) => void
  onAddCategory: () => void
}

export default function CategoryManager({
  categorias,
  formDataCategory,
  novaCategoria,
  setNovaCategoria,
  onCategoryChange,
  onAddCategory,
}: CategoryManagerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-gray-700">Category</Label>
      <div className="grid md:grid-cols-2 grid-flow-row auto-rows-max gap-3">
        <Select value={formDataCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input placeholder="New category" value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} />
          <Button
            type="button"
            onClick={onAddCategory}
            className="bg-[#8B4513] hover:bg-[#7a3a00] text-white font-medium transition-all duration-200 shadow-sm"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
