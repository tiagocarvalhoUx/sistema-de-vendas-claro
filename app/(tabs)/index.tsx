import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { TrendingUp, Wifi, Tv, Smartphone, Package } from "lucide-react-native";
import { useSales } from "@/contexts/SalesContext";
import Colors from "@/constants/colors";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.cardIcon}>{icon}</View>
      <View style={styles.cardContent}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { summary, isLoading } = useSales();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard de Vendas</Text>
        <Text style={styles.headerSubtitle}>Visão geral do sistema Claro</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total de Vendas"
          value={summary.totalVendas}
          icon={<TrendingUp size={28} color={Colors.light.primary} />}
          color={Colors.light.primary}
        />
        <StatCard
          title="Internet Fibra"
          value={summary.vendasInternet}
          icon={<Wifi size={28} color={"#3b82f6"} />}
          color={"#3b82f6"}
        />
        <StatCard
          title="TV por Assinatura"
          value={summary.vendasTV}
          icon={<Tv size={28} color={"#8b5cf6"} />}
          color={"#8b5cf6"}
        />
        <StatCard
          title="Celular"
          value={summary.vendasCelular}
          icon={<Smartphone size={28} color={"#10b981"} />}
          color={"#10b981"}
        />
        <StatCard
          title="Combo"
          value={summary.vendasCombo}
          icon={<Package size={28} color={"#f59e0b"} />}
          color={"#f59e0b"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.lightGray,
  },
  content: {
    padding: 16,
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
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.secondary,
  },
  statsGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "bold" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "500" as const,
  },
});