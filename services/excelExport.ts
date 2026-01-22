// services/excelExport.ts
import type { Client, SalesSummary } from "@/app/types/client";
import { Platform } from "react-native";

export class ExcelExportService {
  /**
   * Exporta a lista de clientes para Excel
   */
  static async exportClients(
    clients: Client[],
    fileName: string = "clientes.xlsx",
  ) {
    try {
      const XLSX = require("xlsx");

      // Formatar dados para exportação
      const data = clients.map((client) => ({
        "Nome Completo": client.nomeCompleto,
        Endereço: client.endereco,
        Telefone: client.telefone,
        "Tipo de Serviço": client.tipoServico,
        "Data de Cadastro": new Date(client.dataCadastro).toLocaleDateString(
          "pt-BR",
        ),
      }));

      // Criar workbook e worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clientes");

      // Ajustar largura das colunas
      const colWidths = [
        { wch: 30 }, // Nome Completo
        { wch: 40 }, // Endereço
        { wch: 15 }, // Telefone
        { wch: 20 }, // Tipo de Serviço
        { wch: 15 }, // Data de Cadastro
      ];
      ws["!cols"] = colWidths;

      // Exportar de acordo com a plataforma
      if (Platform.OS === "web") {
        // WEB: Download direto
        const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
        
        // Converter para blob
        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; i++) {
          view[i] = wbout.charCodeAt(i) & 0xff;
        }
        
        const blob = new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Criar link de download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // MOBILE: Usar expo-file-system e expo-sharing
        const FileSystem = require("expo-file-system");
        const Sharing = require("expo-sharing");

        // Gerar buffer
        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

        // Salvar arquivo
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Compartilhar o arquivo
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Exportar Clientes",
            UTI: "com.microsoft.excel.xlsx",
          });
        } else {
          console.log("Compartilhamento não disponível");
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erro ao exportar clientes:", error);
      return false;
    }
  }

  /**
   * Exporta relatório de vendas com resumo
   */
  static async exportSalesReport(
    clients: Client[],
    summary: SalesSummary,
    fileName: string = "relatorio-vendas.xlsx",
  ) {
    try {
      const XLSX = require("xlsx");

      // Dados dos clientes
      const clientData = clients.map((client) => ({
        "Nome Completo": client.nomeCompleto,
        Endereço: client.endereco,
        Telefone: client.telefone,
        "Tipo de Serviço": client.tipoServico,
        "Data de Cadastro": new Date(client.dataCadastro).toLocaleDateString(
          "pt-BR",
        ),
      }));

      // Dados do resumo
      const summaryData = [
        { Métrica: "Total de Vendas", Quantidade: summary.totalVendas },
        { Métrica: "Internet Fibra", Quantidade: summary.vendasInternet },
        { Métrica: "TV por Assinatura", Quantidade: summary.vendasTV },
        {
          Métrica: "Celular (Controle + Pós)",
          Quantidade: summary.vendasCelular,
        },
        { Métrica: "Combo", Quantidade: summary.vendasCombo },
      ];

      // Criar workbook
      const wb = XLSX.utils.book_new();

      // Adicionar aba de resumo
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      wsSummary["!cols"] = [{ wch: 30 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");

      // Adicionar aba de clientes
      const wsClients = XLSX.utils.json_to_sheet(clientData);
      wsClients["!cols"] = [
        { wch: 30 },
        { wch: 40 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
      ];
      XLSX.utils.book_append_sheet(wb, wsClients, "Clientes");

      // Exportar de acordo com a plataforma
      if (Platform.OS === "web") {
        // WEB: Download direto
        const wbout = XLSX.write(wb, { type: "binary", bookType: "xlsx" });
        
        // Converter para blob
        const buf = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < wbout.length; i++) {
          view[i] = wbout.charCodeAt(i) & 0xff;
        }
        
        const blob = new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Criar link de download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // MOBILE: Usar expo-file-system e expo-sharing
        const FileSystem = require("expo-file-system");
        const Sharing = require("expo-sharing");

        // Gerar buffer
        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

        // Salvar arquivo
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Compartilhar o arquivo
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Exportar Relatório de Vendas",
            UTI: "com.microsoft.excel.xlsx",
          });
        } else {
          console.log("Compartilhamento não disponível");
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      return false;
    }
  }
}