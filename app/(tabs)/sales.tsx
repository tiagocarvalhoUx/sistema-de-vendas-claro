import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { FileDown, Trash2, Calendar, Phone, MapPin, Package } from "lucide-react-native";
import { useSales } from "@/contexts/SalesContext";
import Colors from "@/constants/colors";
import type { Client } from "@/types/client";
import { Stack } from "expo-router";
import * as XLSX from "xlsx";

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
}

function ClientCard({ client, onDelete }: ClientCardProps) {
  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o cliente ${client.nomeCompleto}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(client.id),
        },
      ]
    );
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName}>{client.nomeCompleto}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={20} color={Colors.light.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <MapPin size={16} color={Colors.light.secondary} />
          <Text style={styles.infoText}>{client.endereco}</Text>
        </View>

        <View style={styles.infoRow}>
          <Phone size={16} color={Colors.light.secondary} />
          <Text style={styles.infoText}>{client.telefone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Package size={16} color={Colors.light.primary} />
          <Text style={[styles.infoText, styles.serviceText]}>{client.tipoServico}</Text>
        </View>

        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.light.secondary} />
          <Text style={styles.infoText}>Cadastrado em {formatDate(client.dataCadastro)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function SalesListScreen() {
  const { clients, isLoading, deleteClient, isDeleting } = useSales();

  const exportToExcel = () => {
    if (clients.length === 0) {
      Alert.alert("Aviso", "Não há clientes para exportar");
      return;
    }

    try {
      const data = clients.map((client) => ({
        "Nome Completo": client.nomeCompleto,
        "Endereço": client.endereco,
        "Telefone": client.telefone,
        "Tipo de Serviço": client.tipoServico,
        "Data de Cadastro": new Date(client.dataCadastro).toLocaleDateString("pt-BR"),
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clientes");

      if (Platform.OS === "web") {
        XLSX.writeFile(wb, `clientes_claro_${new Date().getTime()}.xlsx`);
        Alert.alert("Sucesso", "Relatório exportado com sucesso!");
      } else {
        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        Alert.alert("Info", "Exportação em desenvolvimento para mobile");
        console.log("Excel base64:", wbout);
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
      Alert.alert("Erro", "Não foi possível exportar o relatório");
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Lista de Vendas" }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Carregando clientes...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Lista de Vendas" }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Clientes Cadastrados</Text>
            <Text style={styles.headerSubtitle}>
              {clients.length} {clients.length === 1 ? "cliente" : "clientes"} no sistema
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={exportToExcel}
            activeOpacity={0.7}
          >
            <FileDown size={20} color={Colors.light.card} />
            <Text style={styles.exportButtonText}>Exportar</Text>
          </TouchableOpacity>
        </View>

        {clients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={64} color={Colors.light.secondary} />
            <Text style={styles.emptyTitle}>Nenhum cliente cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Cadastre seu primeiro cliente na aba "Cadastro"
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} onDelete={deleteClient} />
            ))}
          </ScrollView>
        )}

        {isDeleting && (
          <View style={styles.deletingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.deletingText}>Excluindo...</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.secondary,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginTop: 2,
  },
  exportButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  exportButtonText: {
    color: Colors.light.card,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.light.text,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  cardContent: {
    gap: 10,
  },
  infoRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.secondary,
    flex: 1,
  },
  serviceText: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.secondary,
    textAlign: "center" as const,
  },
  deletingOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  deletingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.card,
    fontWeight: "600" as const,
  },
});
