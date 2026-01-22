import type { ServiceType } from "@/app/types/client";
import Colors from "@/constants/colors";
import { useSales } from "@/contexts/SalesContext";
import { Stack } from "expo-router";
import { Check, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SERVICE_OPTIONS: ServiceType[] = [
  "Internet Fibra",
  "TV por Assinatura",
  "Celular Controle",
  "Celular Pós-Pago",
  "Combo",
];

export default function RegisterScreen() {
  const { createClient, isCreating } = useSales();
  const [nomeCompleto, setNomeCompleto] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [tipoServico, setTipoServico] = useState<ServiceType>("Internet Fibra");

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (text: string) => {
    setTelefone(formatPhone(text));
  };

  const handleSubmit = () => {
    if (!nomeCompleto.trim()) {
      Alert.alert("Erro", "Por favor, preencha o nome completo");
      return;
    }
    if (!endereco.trim()) {
      Alert.alert("Erro", "Por favor, preencha o endereço");
      return;
    }
    if (!telefone.trim()) {
      Alert.alert("Erro", "Por favor, preencha o telefone");
      return;
    }

    createClient(
      {
        nomeCompleto: nomeCompleto.trim(),
        endereco: endereco.trim(),
        telefone: telefone.trim(),
        tipoServico,
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
          setNomeCompleto("");
          setEndereco("");
          setTelefone("");
          setTipoServico("Internet Fibra");
        },
        onError: () => {
          Alert.alert("Erro", "Não foi possível cadastrar o cliente");
        },
      },
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Cadastro de Cliente" }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <UserPlus size={32} color={Colors.light.primary} />
          </View>
          <Text style={styles.headerTitle}>Novo Cliente</Text>
          <Text style={styles.headerSubtitle}>
            Preencha os dados para cadastrar um novo cliente
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              value={nomeCompleto}
              onChangeText={setNomeCompleto}
              placeholder="Digite o nome completo"
              placeholderTextColor={Colors.light.secondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço Completo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, número, bairro, cidade, estado"
              placeholderTextColor={Colors.light.secondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={handlePhoneChange}
              placeholder="(00) 00000-0000"
              placeholderTextColor={Colors.light.secondary}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Serviço</Text>
            <View style={styles.selectContainer}>
              {SERVICE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    tipoServico === option && styles.selectOptionActive,
                  ]}
                  onPress={() => setTipoServico(option)}
                  activeOpacity={0.7}
                >
                  <View style={styles.selectOptionContent}>
                    <Text
                      style={[
                        styles.selectOptionText,
                        tipoServico === option && styles.selectOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                    {tipoServico === option && (
                      <Check size={20} color={Colors.light.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isCreating && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isCreating}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isCreating ? "Cadastrando..." : "Cadastrar Cliente"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
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
  header: {
    alignItems: "center" as const,
    marginBottom: 32,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.card,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.secondary,
    textAlign: "center" as const,
    paddingHorizontal: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  textArea: {
    minHeight: 80,
  },
  selectContainer: {
    gap: 10,
  },
  selectOption: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  selectOptionActive: {
    borderColor: Colors.light.primary,
    backgroundColor: "#fef2f2",
  },
  selectOptionContent: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  selectOptionText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500" as const,
  },
  selectOptionTextActive: {
    color: Colors.light.primary,
    fontWeight: "600" as const,
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center" as const,
    marginTop: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: Colors.light.card,
  },
});
