"use client"

import { Heart, Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'd like to know more about your products.")
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  
  const handleInstaAppClick = () => {
    
    window.open("https://www.instagram.com/")
  }


  return (
    <footer id="footer" className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                      Sugar <span className="text-amber-600">&</span> Spice
                    </h1>
            <p className="text-[#fff8e1]/80 text-sm leading-relaxed">
        Indulge in our collection of artisanal treats, from delicate macarons to grand celebratory cakes.
            </p>
            <div className="flex items-center gap-2 text-[#fff8e1]/90">
              <Heart className="h-4 w-4 text-red-300" />
              <span className="text-sm font-medium">Made with passion since 2024</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#fff8e1] border-b border-[#fff8e1]/20 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-[#fff8e1]/80 hover:text-[#fff8e1] transition-colors duration-200 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#products"
                  className="text-[#fff8e1]/80 hover:text-[#fff8e1] transition-colors duration-200 text-sm"
                >
                  Our Products
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-[#fff8e1]/80 hover:text-[#fff8e1] transition-colors duration-200 text-sm"
                >
                  Shopping Cart
                </a>
              </li>
              <li>
                <Link href="/admin">
          <button className="text-[#fff8e1]/80 hover:text-[#fff8e1] transition-colors duration-200 text-sm text-left cursor-pointer">
            Admin
          </button>
        </Link>
              </li>
              <li>
                <button
                  onClick={handleWhatsAppClick}
                  className="text-[#fff8e1]/80 hover:text-[#fff8e1] transition-colors duration-200 text-sm text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#fff8e1] border-b border-[#fff8e1]/20 pb-2">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#fff8e1]/70 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#fff8e1]/80 text-sm">WhatsApp</p>
                  <button onClick={handleWhatsAppClick} className="text-[#fff8e1] text-sm font-medium hover:underline">
                    +{whatsappNumber}
                  </button>
                </div>
              </div>

              {/* <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#fff8e1]/70 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#fff8e1]/80 text-sm">Email</p>
                  <a href="mailto:info@machebonta.com" className="text-[#fff8e1] text-sm font-medium hover:underline">
                    info@machebonta.com
                  </a>
                </div>
              </div> */}

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#fff8e1]/70 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#fff8e1]/80 text-sm">Location</p>
                  <p className="text-[#fff8e1] text-sm font-medium">Malaysia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#fff8e1] border-b border-[#fff8e1]/20 pb-2">Business Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#fff8e1]/70" />
                <span className="text-[#fff8e1]/80 text-sm">Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
       
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-[#fff8e1] mb-3">Follow Us</h5>
              <div className="flex gap-3">
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-[#fff8e1]/10 hover:bg-[#fff8e1]/20 p-2 rounded-full transition-all duration-200 hover:scale-110"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-[#fff8e1]" />
                </button>
                <button
                onClick={handleInstaAppClick}
                  className="bg-[#fff8e1]/10 hover:bg-[#fff8e1]/20 p-2 rounded-full transition-all duration-200 hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4 text-[#fff8e1]" />
                </button>
           
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#fff8e1]/20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-[#fff8e1]/80 text-sm">© {currentYear} Sugar <span className="text-amber-600">&</span> Spice. All rights reserved.</p>
              <p className="text-[#fff8e1]/60 text-xs mt-1">Boutique Confectionery</p>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#fff8e1]/60">
              <button className="hover:text-[#fff8e1]/80 transition-colors duration-200">Privacy Policy</button>
              <button className="hover:text-[#fff8e1]/80 transition-colors duration-200">Terms of Service</button>
              <button className="hover:text-[#fff8e1]/80 transition-colors duration-200">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="h-1 bg-linear-to-r from-[#fff8e1]/20 via-[#fff8e1]/40 to-[#fff8e1]/20"></div>
    </footer>
  )
}
