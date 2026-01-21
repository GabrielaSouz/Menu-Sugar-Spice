import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Send } from "lucide-react"
import { useCartPricing, type CartItem } from "@/hooks/useCart"

interface OrderSummaryProps {
  cartItems: CartItem[]
  name: string
  phone: string
  onNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function OrderSummary({ 
  cartItems, 
  name, 
  phone, 
  onNameChange, 
  onPhoneChange, 
  onSubmit 
}: OrderSummaryProps) {
  const { getItemPrice, hasPromotion, calculateTotal } = useCartPricing()

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cartItems.map((item, index) => {
            const price = getItemPrice(item)

            // Criar label das variações
            let variationsLabel = ""
            if (item.selectedVariations && item.selectedVariations.length > 0) {
              variationsLabel = ` (${item.selectedVariations.map((v) => v.option.label).join(", ")})`
            } else if (item.selectedType) {
              variationsLabel = ` (${item.selectedType.label})`
            }

            const itemHasPromotion = hasPromotion(item)
            const promotionLabel = itemHasPromotion ? " (SALE)" : ""

            return (
              <div key={index} className="flex justify-between text-sm">
                <span className="flex-1 pr-2">
                  {item.product.title}
                  {variationsLabel}
                  {promotionLabel} (x{item.quantity})
                </span>
                <span className="font-medium">MYR {(price * item.quantity).toFixed(2)}</span>
              </div>
            )
          })}
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>MYR {calculateTotal(cartItems).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      {/* Form envio WhatsApp */}
      <CardFooter>
        <form onSubmit={onSubmit} className="w-full space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Your WhatsApp</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              required
              placeholder="Ex: 5511999999999"
            />
          </div>
          <Button
            type="submit"
            className="w-full flex items-center gap-2 bg-white text-rose-500 hover:bg-rose-500 border-2 border-rose-500 hover:text-white h-12"
          >
            <Send className="h-4 w-4" />
            Send order via WhatsApp
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
