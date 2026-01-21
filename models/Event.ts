export interface Event {
  id: string
  title: string
  description: string
  price?: number
  sale?: number
  image?: string
  category: string
  created_at?: string
  variation_categories?: VariationCategory[]
}

export interface VariationCategory {
  id: string
  name: string
  options: VariationOption[]
}

export interface VariationOption {
  id: string
  label: string
  price: number
}
