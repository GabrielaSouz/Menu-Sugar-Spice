// lib/cart.ts

import { EventProduct } from "@/types/event";

export const getCart = () => {
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
};

export const addToCart = (event: EventProduct) => {
  const cart = getCart();
  const existingIndex = cart.findIndex((item: any) => item.product.id === event.id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      product: { ...event },
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

export const getCartCount = () => {
  const cart = getCart();
  return cart.reduce((total: number, item: any) => total + item.quantity, 0);
};
