import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center p-8 bg-linear-to-r from-slate-50 to-gray-50 shadow-lg border border-gray-100 rounded-2xl mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex gap-3">
        <a href="/" target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Ver loja
          </Button>
        </a>
        <Link href="/logout">
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
          >
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}
