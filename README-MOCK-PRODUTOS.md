# ⚠️ INSTRUÇÕES - PRODUTOS MOCK (APENAS PARA DESENVOLVIMENTO)

## 📋 O QUE FOI IMPLEMENTADO

Foi adicionado um sistema de **produtos mock** para garantir que a aplicação sempre tenha conteúdo para exibir, mesmo quando o Supabase estiver pausado ou inativo.

## 🗂️ ARQUIVOS CRIADOS/MODIFICADOS

### Novos Arquivos:
- `data/mockProducts.ts` - Contém os produtos de exemplo
- `hooks/useProducts.ts` - Hook que gerencia a fonte de dados (Supabase vs Mock)

### Arquivos Modificados:
- `components/ProductList.tsx` - Agora usa o hook `useProducts`
- `app/page.tsx` - Removeu a prop `products` do ProductList

## 🔧 COMO FUNCIONA

O sistema funciona em 2 modos:

### 1. **MODO DESENVOLVIMENTO (ATUAL)**
```typescript
// Em hooks/useProducts.ts
const useMockData = true; // ✅ ATIVO
```
- Tenta buscar do Supabase primeiro
- Se falhar ou estiver vazio, usa produtos mock automaticamente
- Permite desenvolver mesmo com Supabase pausado

### 2. **MODO PRODUÇÃO (PARA ENTREGAR AO CLIENTE)**
```typescript
// Em hooks/useProducts.ts
const useMockData = false; // ✅ MUDAR PARA FALSE
```
- Usa **APENAS** dados do Supabase
- Se o Supabase falhar, mostra erro (não usa mock)
- Comportamento padrão de produção

---

## 🚨 **AÇÃO OBRIGATÓRIA ANTES DE ENTREGAR AO CLIENTE**

### PASSO 1: Desativar produtos mock
Abra o arquivo `hooks/useProducts.ts` e altere:

```typescript
// MUDAR ISTO:
const useMockData = true; // ❌ Desenvolvimento

// PARA ISTO:
const useMockData = false; // ✅ Produção
```

### PASSO 2: Remover arquivos mock (OPCIONAL)
```bash
# Remover arquivo de produtos mock
rm data/mockProducts.ts

# Ou renomear para manter como backup
mv data/mockProducts.ts data/mockProducts.ts.backup
```

### PASSO 3: Limpar imports (OPCIONAL)
Se removeu o arquivo, remova também:
- Import de `mockProducts` em `hooks/useProducts.ts`
- Import de `shouldUseMockProducts` em `hooks/useProducts.ts`

---

## 🧪 TESTES ANTES DE ENTREGAR

1. **Teste com Supabase ativo:**
   ```bash
   npm run dev
   ```
   - Deve mostrar produtos do Supabase
   - Não deve mostrar produtos mock

2. **Teste fallback (apenas em desenvolvimento):**
   - Desconecte do Supabase
   - Deve mostrar produtos mock automaticamente

---

## 📝 LEMBRETES IMPORTANTES

- ✅ **PRODUTOS MOCK SÃO APENAS PARA SEU USO** durante desenvolvimento
- ✅ **CLIENTE NUNCA DEVE VER PRODUTOS MOCK** 
- ✅ **LEMBRE-SE DE DESATIVAR** antes de fazer o deploy final
- ✅ **GUARDE ESTE ARQUIVO** como referência futura

---

## 🔍 COMO IDENTIFICAR SE ESTÁ USANDO MOCK

No console do navegador, você verá:
- `🔄 Usando produtos mock (Supabase indisponível ou vazio)` - Se estiver usando mock
- `✅ Usando produtos do Supabase` - Se estiver usando Supabase

---

## 📞 SUPORTE

Se tiver dúvidas:
1. Verifique o console do navegador
2. Confirme a configuração em `hooks/useProducts.ts`
3. Teste com e sem conexão Supabase

---

**ÚLTIMA ATUALIZAÇÃO:** 25/02/2026  
**VERSÃO:** 1.0
