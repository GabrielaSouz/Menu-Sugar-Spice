
import Image from "next/image"

export function Hero() {

  const scrollToProducts = () => {
    const element = document.getElementById("products")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }
  return (
     <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-rose-50 via-white to-white">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Image 
            src="/header.avif" 
            alt="Decoration" 
            className="h-full w-full object-cover"
            width={500}
            height={70}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <span className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              Boutique Confectionery
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Crafted with <span className="text-rose-500 font-serif italic font-normal">love</span> & sugar.
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-lg">
              Indulge in our collection of artisanal treats, from delicate macarons to grand celebratory cakes. Every bite tells a story.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={scrollToProducts}
                className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-rose-200 text-center cursor-pointer"
              >
                Order Online
              </button>
        
            </div>
          </div>
        </div>
      </section>
  )
}
