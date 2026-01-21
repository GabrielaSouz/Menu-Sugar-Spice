"use client"

import { useEffect, useState } from "react"

export default function PromotionBanner() {
  const [promos, setPromos] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch("/api/promotions")
      .then((res) => res.json())
      .then((data) => {
        const activePromos = data.filter((p: any) => p.active).map((p: any) => p.message)
        setPromos(activePromos)
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error)
      })
  }, [])

  // Rotação automática entre promoções
  useEffect(() => {
    if (promos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [promos.length])

  if (promos.length === 0) return null

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          0% { transform: translateX(100%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-slide {
          animation: slideIn 4s ease-in-out infinite;
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="bg-slate-900 text-white py-3 px-4 overflow-hidden relative">
        {/* Efeito de brilho de fundo */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse-slow"></div>

        <div className="relative z-10">
          {promos.length === 1 ? (
            // Uma promoção - efeito marquee
            <div className="flex justify-center">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-base font-medium flex items-center gap-2">
                  <span className="text-yellow-300">🎉</span>
                  {promos[0]}
                  <span className="text-yellow-300">🎉</span>
                </span>
              </div>
            </div>
          ) : (
            // Múltiplas promoções - fade entre elas
            <div className="text-center">
              <div className="h-6 flex items-center justify-center">
                {promos.map((promo, index) => (
                  <div
                    key={index}
                    className={`absolute transition-all duration-500 ease-in-out transform ${
                      index === currentIndex
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-2 scale-95"
                    }`}
                  >
                    <span className="text-base font-medium flex items-center gap-2">
                      <span className="text-yellow-300">🎉</span>
                      {promo}
                      <span className="text-yellow-300">🎉</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Indicadores de progresso */}
              {promos.length > 1 && (
                <div className="flex justify-center mt-2 gap-1">
                  {promos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 w-4 rounded-full transition-all duration-300 ${
                        index === currentIndex ? "bg-yellow-300 w-8" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
