'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResetButtonProps {
  onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    const confirmed = confirm("Tem certeza que deseja apagar todos os eventos? Essa ação é irreversível.");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch("/api/events/resent", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetAll: true }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Todos os produtos foram apagados com sucesso.");
        onReset(); // Atualiza os dados
      } else {
        toast.error(data?.message || "Erro ao apagar os produtos.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-4">
      <Button
        onClick={handleReset}
        variant="destructive"
        disabled={loading}
      >
        {loading ? "Apagando..." : "Apagar todos os Produtos"}
      </Button>
    </div>
  );
}
