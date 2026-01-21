import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useCartPricing, type CartItem } from "@/hooks/useCart"

interface WhatsAppOrderProps {
  cartItems: CartItem[]
  name: string
  phone: string
  whatsappNumber?: string
  onSuccess?: () => void
}

export const useWhatsAppOrder = () => {
  const router = useRouter()
  const { getItemPrice, calculateTotal } = useCartPricing()

  const generateMessage = (cartItems: CartItem[], name: string, phone: string): string => {
    let message = `*New Order*

Customer: ${name}
Phone: ${phone}

*Items:*
`
    cartItems.forEach((item) => {
      const price = getItemPrice(item)

      let variationsText = ""
      if (item.selectedVariations && item.selectedVariations.length > 0) {
        variationsText = ` (${item.selectedVariations.map((v) => v.option.label).join(", ")})`
      } else if (item.selectedType) {
        variationsText = ` (${item.selectedType.label})`
      }

      const hasPromotion =
        item.product.sale &&
        item.product.sale > 0 &&
        item.product.price &&
        item.product.sale < item.product.price &&
        (!item.selectedVariations || item.selectedVariations.length === 0) &&
        !item.selectedType

      const promotionLabel = hasPromotion ? " (SALE)" : ""

      message += `- ${item.product.title}${variationsText}${promotionLabel} (${item.quantity}x) - MYR ${(price * item.quantity).toFixed(2)}
`
    })
    message += `
*Total: MYR ${calculateTotal(cartItems).toFixed(2)}*`
    return message
  }

  const validateOrder = (cartItems: CartItem[], name: string, phone: string): boolean => {
    // Validar campos obrigatórios
    if (!name || !phone) {
      toast.error("Please fill in name and phone to continue")
      return false
    }

    // Validar itens do carrinho
    for (const [index, item] of cartItems.entries()) {
      // Verificar se produtos com types antigos têm seleção
      if (
        (item.product.types ?? []).length > 0 &&
        !item.selectedType &&
        (!item.selectedVariations || item.selectedVariations.length === 0)
      ) {
        toast.error(`Please select a type for "${item.product.title}"`)
        return false
      }

      // Verificar se produtos com variationCategories têm todas as seleções
      if (item.product.variationCategories && item.product.variationCategories.length > 0) {
        if (!item.selectedVariations || item.selectedVariations.length === 0) {
          toast.error(`Please select variations for "${item.product.title}"`)
          return false
        }

        // Verificar se todas as categorias foram selecionadas
        const missingCategories = item.product.variationCategories.filter(
          (category) => !item.selectedVariations!.some((variation) => variation.categoryName === category.name),
        )

        if (missingCategories.length > 0) {
          toast.error(`Please select all variations for "${item.product.title}"`)
          return false
        }
      }
    }

    return true
  }

  const sendToWhatsApp = ({ cartItems, name, phone, whatsappNumber, onSuccess }: WhatsAppOrderProps) => {
    if (!validateOrder(cartItems, name, phone)) {
      return
    }

    const message = generateMessage(cartItems, name, phone)
    const encodedMessage = encodeURIComponent(message)
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappURL, "_blank")
    toast.success("Order sent via WhatsApp!")
    
    if (onSuccess) {
      onSuccess()
    }
    
    router.push("/")
  }

  return {
    generateMessage,
    validateOrder,
    sendToWhatsApp,
  }
}
