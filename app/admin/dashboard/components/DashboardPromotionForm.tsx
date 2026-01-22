"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"


interface Promotion {
  id: string
  message: string
  active: boolean
  createAt: string
  expires_at?: string
}

export default function DashboardPromotionForm() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [formData, setFormData] = useState({
    message: "",
    active: true,
    expires_at: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/promotions")
      const data = await res.json()
      setPromotions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching promotions:", error)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.message.trim()) {
      toast.error("Message is required")
      return
    }

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/promotions/${editingId}` : "/api/promotions"

      const payload = {
        ...formData,
        active: formData.active,
        expires_at: formData.expires_at || null
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingId ? "Promotion updated!" : "Promotion created!")
        fetchPromotions()
        resetForm()
      } else {
        toast.error("Error saving promotion")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error saving promotion")
    }
  }
  
  const handleEdit = (promotion: Promotion) => {
    setFormData({
      message: promotion.message,
      active: promotion.active,
      expires_at: promotion.expires_at ? promotion.expires_at.split("T")[0] : "",
    })
    setEditingId(promotion.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return

    try {
      const res = await fetch(`/api/promotions/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Promotion deleted!")
        fetchPromotions()
      } else {
        toast.error("Error deleting promotion")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error deleting promotion")
    }
  }

  const resetForm = () => {
    setFormData({
      message: "",
      active: true,
      expires_at: "",
    })
    setEditingId(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full h-fit lg:h-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-4">Manage Promotions</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
            Promotion Message
          </Label>
          <Input
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="e.g. 20% OFF on all products!"
            required
            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12 text-base"
          />
        </div>

        <div>
          <Label htmlFor="expires_at" className="text-sm font-semibold text-gray-700">
            Expiration Date (optional)
          </Label>
          <Input
            id="expires_at"
            type="date"
            value={formData.expires_at}
            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 h-12 text-base"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
          />
          <Label htmlFor="active" className="text-sm font-semibold text-gray-700">
            Active
          </Label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            type="submit"
            className="bg-[#8B4513] hover:bg-zinc-900 text-white font-semibold px-8 py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {editingId ? "Update" : "Create"} Promotion
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-semibold px-8 py-3 transition-all duration-200"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Promotions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Active Promotions</h3>
        {promotions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No promotions registered</p>
        ) : (
          <div className="space-y-3">
            {promotions.map((promotion) => (
              <Card key={promotion.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{promotion.message}</p>
                      {/* <p className="text-xs text-gray-500">{promotion.expires_at ? new Date(promotion.expires_at).toLocaleDateString("en-US") : "No expiration date"}</p> */}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${promotion.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {promotion.active ? "Active" : "Inactive"}
                        </span>
                        {promotion.expires_at && (
                          <span>Expires: {new Date(promotion.expires_at).toLocaleDateString("en-US")}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(promotion)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(promotion.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
