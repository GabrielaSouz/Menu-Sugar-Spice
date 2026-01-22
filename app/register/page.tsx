"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export default function Register() {
const router = useRouter()
   const [name, setName] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
   const [loading, setLoading] = useState(false)

   async function handleRegister(e: React.FormEvent) {
      e.preventDefault()
      setLoading(true)
 
      try {
         const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
         })
 
         const data = await res.json()
         setLoading(false)

         if (!data.success) {
            toast.error(data.error || "Erro ao criar conta")
            return
         }

         toast.success("Conta criada com sucesso!")
         
         // Se tiver sessão, salva o cookie e redireciona para admin
         if (data.session?.access_token) {
            const expires = new Date()
            expires.setTime(expires.getTime() + (60 * 60 * 1000)) // 1 hora
            
            document.cookie = `sb-access-token=${data.session.access_token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
            
            // Redireciona diretamente para o dashboard
            setTimeout(() => {
                router.push("/admin/dashboard")
            }, 500)
         } else {
            // Se não tiver sessão, redireciona para login
            setTimeout(() => {
                router.push("/login")
            }, 1500)
         }
         
         // Limpa o formulário
         setName("")
         setEmail("")
         setPassword("")
      } catch (error) {
         setLoading(false)
         toast.error("Erro de conexão. Tente novamente.")
      }
   }


    return(
      <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <Image
            src="/cake_register.jpg"
            alt="Logo"
            width={500}
            height={500}
            className="h-72 object-cover mb-2 rounded-t-lg opacity-40"></Image>
        
        <div className="p-8">

     
            <h1 className="text-slate-800 text-2xl font-bold text-center mb-4 ">Get Started <span className="font-serif italic text-rose-500">Now</span></h1>

            <div className="text-center text-sm mb-6">
                <Link href="/login" className="text-slate-800 hover:text-slate-400 ">Login</Link>
                <span className="mx-2 text-slate-900">|</span>
                <Link href="/register" className="text-rose-500 hover:text-rose-600">Register</Link>
                 <span className="mx-2 text-slate-900">|</span>
                  <Link href="/" className="text-slate-800 hover:text-slate-400 ">Home</Link>
            </div>


            <form onSubmit={handleRegister} action="" className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className="text-slate-700 font-semibold">Name</Label>
                    <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="border-slate-300 text-sm" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                    <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="border-slate-300 text-sm" />
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                    <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="border-slate-300 text-sm" />
                </div>

                <Button type="submit" className="w-full mt-2.5 bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-200 cursor-pointer" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</Button>
            </form>
        </div>
        </div>
        </div>
    )
}