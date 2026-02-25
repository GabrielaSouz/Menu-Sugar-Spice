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
    title: "Bolo de Chocolate Premium",
    description: "Bolo fofo de chocolate com cobertura de ganache e raspas de chocolate belga",
    category: "Bolos",
    price: 85.00,
    image: "/images/bolo-chocolate.jpg"
  },
  {
    id: "mock-2", 
    title: "Torta de Limão Siciliano",
    description: "Torta refrescante com creme de limão siciliano e merengue tostado",
    category: "Tortas",
    price: 65.00,
    image: "/images/torta-limao.jpg"
  },
  {
    id: "mock-3",
    title: "Cupcake Red Velvet",
    description: "Cupcake de veludo vermelho com cream cheese frosting",
    category: "Cupcakes",
    price: 12.00,
    image: "/images/cupcake-redvelvet.jpg"
  },
  {
    id: "mock-4",
    title: "Donut Glacé de Morango",
    description: "Donut fofinho com glacê de morango natural e confeitos coloridos",
    category: "Donuts",
    price: 8.00,
    image: "/images/donut-morango.jpg"
  },
  {
    id: "mock-5",
    title: "Cheesecake Frutas Vermelhas",
    description: "Cheesecake cremoso com calda de frutas vermelhas frescas",
    category: "Tortas",
    price: 75.00,
    image: "/images/cheesecake-frutas.jpg"
  },
  {
    id: "mock-6",
    title: "Cookie de Chocolate",
    description: "Cookie gigante com pedaços de chocolate meio amargo",
    category: "Cookies",
    price: 6.00,
    image: "/images/cookie-chocolate.jpg"
  },
  {
    id: "mock-7",
    title: "Empada de Frango",
    description: "Empadazinha com massa folhada e recheio cremoso de frango",
    category: "Salgados",
    price: 7.50,
    image: "/images/empada-frango.jpeg"
  },
  {
    id: "mock-8",
    title: "Pão de Mel Recheado",
    description: "Pão de mel tradicional recheado com doce de leite",
    category: "Doces",
    price: 5.50,
    image: "/images/pao-mel.jpg"
  }
];

// Função para verificar se deve usar produtos mock
export const shouldUseMockProducts = (supabaseData: any[] | null, error: any): boolean => {
  // Usa mock se houver erro, não houver dados, ou se os dados estiverem vazios
  return !!error || !supabaseData || supabaseData.length === 0;
};
