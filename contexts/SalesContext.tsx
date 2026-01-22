import type { ClientInput, SalesSummary } from "@/app/types/client";
import { ClientService } from "@/services/api";
import createContextHook from "@nkzw/create-context-hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const [SalesProvider, useSales] = createContextHook(() => {
  const queryClient = useQueryClient();

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () => ClientService.getAllClients(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ClientInput) => ClientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientInput }) =>
      ClientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ClientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const summary: SalesSummary = useMemo(() => {
    const clients = clientsQuery.data || [];
    return {
      totalVendas: clients.length,
      vendasInternet: clients.filter((c) => c.tipoServico === "Internet Fibra")
        .length,
      vendasTV: clients.filter((c) => c.tipoServico === "TV por Assinatura")
        .length,
      vendasCelular: clients.filter(
        (c) =>
          c.tipoServico === "Celular Controle" ||
          c.tipoServico === "Celular Pós-Pago",
      ).length,
      vendasCombo: clients.filter((c) => c.tipoServico === "Combo").length,
    };
  }, [clientsQuery.data]);

  return {
    clients: clientsQuery.data || [],
    isLoading: clientsQuery.isLoading,
    summary,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
});
