// ===== PRODUTOS MOCK (APENAS PARA DEMO/DESENVOLVIMENTO) =====
// ESTES PRODUTOS SÃO USADOS QUANDO O SUPABASE ESTÁ PAUSADO OU INATIVO
// REMOVA ESTE ARQUIVO OU COMENTE SEU USO ANTES DE ENTREGAR AO CLIENTE FINAL
// ==============================================================

export interface MockProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  image?: string;
  variation_categories?: any[];
}

export const mockProducts: MockProduct[] = [
  {
    id: "mock-1",
    title: "Premium Chocolate Cake",
    description: "Fluffy chocolate cake with ganache frosting and Belgian chocolate shavings",
    category: "Cakes",
    price: 85.00,
    image: "/images/bolo-chocolate.jpg"
  },
  {
    id: "mock-2",
    title: "Sicilian Lemon Tart",
    description: "Refreshing tart with Sicilian lemon cream and toasted meringue",
    category: "Tarts",
    price: 65.00,
    image: "/images/torta-limao.jpg"
  },
  {
    id: "mock-3",
    title: "Red Velvet Cupcake",
    description: "Red velvet cupcake with cream cheese frosting",
    category: "Cupcakes",
    price: 12.00,
    image: "/images/cupcake-redvelvet.jpg"
  },
  {
    id: "mock-4",
    title: "Strawberry Glazed Donut",
    description: "Fluffy donut with natural strawberry glaze and colorful sprinkles",
    category: "Donuts",
    price: 8.00,
    image: "/images/donut-morango.jpg"
  },
  {
    id: "mock-5",
    title: "Red Fruit Cheesecake",
    description: "Creamy cheesecake with fresh red fruit sauce",
    category: "Cakes",
    price: 75.00,
    image: "/images/cheesecake-frutas.jpg"
  },
  {
    id: "mock-6",
    title: "Chocolate Cookie",
    description: "Giant cookie with semi-sweet chocolate chunks",
    category: "Cookies",
    price: 6.00,
    image: "/images/cookie-chocolate.jpg"
  },
  {
    id: "mock-7",
    title: "Chicken Empanada",
    description: "Small empanada with puff pastry and creamy chicken filling",
    category: "Savory",
    price: 7.50,
    image: "/images/empada-frango.jpeg"
  },
  {
    id: "mock-8",
    title: "Stuffed Honey Bread",
    description: "Traditional honey bread filled with dulce de leche",
    category: "Sweets",
    price: 5.50,
    image: "/images/pao-mel.jpg"
  }
];

// Função para verificar se deve usar produtos mock
export const shouldUseMockProducts = (supabaseData: any[] | null, error: any): boolean => {
  // Usa mock se houver erro, não houver dados, ou se os dados estiverem vazios
  return !!error || !supabaseData || supabaseData.length === 0;
};
