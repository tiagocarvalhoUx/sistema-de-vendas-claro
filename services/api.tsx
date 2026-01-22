import type { Client, ClientInput } from "@/app/types/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@claro_clients";

export const ClientService = {
  async getAllClients(): Promise<Client[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      return [];
    }
  },

  async createClient(clientData: ClientInput): Promise<Client> {
    try {
      const clients = await this.getAllClients();
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData,
        dataCadastro: new Date().toISOString(),
      };
      const updatedClients = [...clients, newClient];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClients));
      return newClient;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  },

  async updateClient(id: string, clientData: ClientInput): Promise<Client> {
    try {
      const clients = await this.getAllClients();
      const index = clients.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Cliente não encontrado");

      const updatedClient: Client = {
        ...clients[index],
        ...clientData,
      };
      clients[index] = updatedClient;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
      return updatedClient;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      console.log("🔴 [DELETE] Iniciando exclusão do cliente ID:", id);
      
      const clients = await this.getAllClients();
      console.log("🔴 [DELETE] Total de clientes antes:", clients.length);
      console.log("🔴 [DELETE] IDs dos clientes:", clients.map(c => c.id));
      
      const filtered = clients.filter((c) => c.id !== id);
      console.log("🔴 [DELETE] Total de clientes depois:", filtered.length);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      console.log("🔴 [DELETE] Cliente excluído com sucesso!");
      
      // Verificar se realmente salvou
      const verification = await this.getAllClients();
      console.log("🔴 [DELETE] Verificação - Total atual:", verification.length);
      
    } catch (error) {
      console.error("🔴 [DELETE] Erro ao deletar cliente:", error);
      throw error;
    }
  },
};