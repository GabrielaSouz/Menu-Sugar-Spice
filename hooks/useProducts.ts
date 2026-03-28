"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mockProducts, shouldUseMockProducts } from '@/data/mockProducts';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  image?: string;
  variation_categories?: any[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // ===== CONFIGURAÇÃO IMPORTANTE =====
      // Para DESABILITAR produtos mock e usar apenas Supabase:
      // Comente a linha abaixo e descomente a linha "const useMockData = false;"
      const useMockData = true; // Mude para false quando o Supabase estiver sempre ativo
      // const useMockData = false; // Use esta linha quando for entregar ao cliente
      // =================================

      if (useMockData) {
        // Tenta buscar do Supabase primeiro
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (shouldUseMockProducts(data, error)) {
          console.log('🔄 Usando produtos mock (Supabase indisponível ou vazio)');
          setProducts(mockProducts);
          setUsingMock(true);
          if (error) {
            console.warn('Erro do Supabase:', error.message);
          }
        } else {
          console.log('✅ Usando produtos do Supabase');
          setProducts(data || []);
          setUsingMock(false);
        }
      } else {
        // Modo produção: usa apenas Supabase
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setProducts(data || []);
        setUsingMock(false);
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para produtos mock mesmo em modo produção se houver erro crítico
      if (!usingMock) {
        console.log('🔄 Fallback para produtos mock devido a erro');
        setProducts(mockProducts);
        setUsingMock(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    usingMock,
    error,
    refetch
  };
}
