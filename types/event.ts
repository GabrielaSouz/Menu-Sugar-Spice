export interface SelectedVariation {
  categoryName: string
  option: {
    label: string
    price: number
  }
}

export interface EventType {
  label: string // ex: "normal", "gluten free"
  price: number // preço específico para esse tipo
}

export interface EventProduct {
  sale: number
  id: string
  title: string
  description: string
  image: string | null
  category: string
  price: number // preço padrão, usado se não tiver 'types'
  types?: Array<{
    label: string
    price: number
  }>
  variationCategories?: Array<{
    name: string
    options: Array<{
      label: string
      price: number
    }>
  }>
  createdAt?: string // Adicionado
  updatedAt?: string // Adicionado
}
