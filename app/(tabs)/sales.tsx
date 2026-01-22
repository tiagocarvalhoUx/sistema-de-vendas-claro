import type { Client } from "@/app/types/client";
import Colors from "@/constants/colors";
import { useSales } from "@/contexts/SalesContext";
import { ExcelExportService } from "@/services/excelExport";
import { Stack } from "expo-router";
import {
  Calendar,
  FileDown,
  MapPin,
  Package,
  Phone,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DeleteConfirmProps {
  visible: boolean;
  clientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmDialog({
  visible,
  clientName,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>Confirmar Exclusão</Text>
          <Text style={styles.dialogMessage}>
            Deseja realmente excluir o cliente {clientName}?
          </Text>

          <View style={styles.dialogButtons}>
            <TouchableOpacity
              style={[styles.dialogButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dialogButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
}

function ClientCard({ client, onDelete }: ClientCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    console.log("🟢 [CARD] Confirmação aceita, chamando onDelete");
    setShowConfirm(false);
    onDelete(client.id);
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{client.nomeCompleto}</Text>
          <TouchableOpacity
            onPress={() => setShowConfirm(true)}
            style={styles.deleteButton}
          >
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
            <Text style={[styles.infoText, styles.serviceText]}>
              {client.tipoServico}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={16} color={Colors.light.secondary} />
            <Text style={styles.infoText}>
              Cadastrado em {formatDate(client.dataCadastro)}
            </Text>
          </View>
        </View>
      </View>

      <DeleteConfirmDialog
        visible={showConfirm}
        clientName={client.nomeCompleto}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

export default function SalesListScreen() {
  const { clients, isLoading, deleteClient, isDeleting } = useSales();

  const handleDeleteClient = (id: string) => {
    console.log("🟡 [SALES] handleDeleteClient chamado com ID:", id);
    deleteClient(id);
  };

  const exportToExcel = async () => {
    if (clients.length === 0) {
      Alert.alert("Aviso", "Não há clientes para exportar");
      return;
    }

    try {
      await ExcelExportService.exportClients(clients);
      Alert.alert("Sucesso", "Relatório exportado com sucesso!");
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
              {clients.length} {clients.length === 1 ? "cliente" : "clientes"}{" "}
              no sistema
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
              <ClientCard
                key={client.id}
                client={client}
                onDelete={handleDeleteClient}
              />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.secondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginTop: 2,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  exportButtonText: {
    color: Colors.light.card,
    fontSize: 14,
    fontWeight: "600",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.secondary,
    flex: 1,
  },
  serviceText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.light.secondary,
    textAlign: "center",
  },
  deletingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deletingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.card,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
  },
  dialogMessage: {
    fontSize: 16,
    color: Colors.light.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  dialogButtons: {
    flexDirection: "row",
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.light.lightGray,
  },
  confirmButton: {
    backgroundColor: Colors.light.error,
  },
  cancelText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmText: {
    color: Colors.light.card,
    fontSize: 16,
    fontWeight: "600",
  },
});