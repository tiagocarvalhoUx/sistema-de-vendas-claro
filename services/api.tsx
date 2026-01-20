import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Client, ClientInput } from "@/types/client";

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
      const clients = await this.getAllClients();
      const filtered = clients.filter((c) => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  },
};