export type ServiceType = 
  | "Internet Fibra"
  | "TV por Assinatura"
  | "Celular Controle"
  | "Celular Pós-Pago"
  | "Combo";

export interface Client {
  id: string;
  nomeCompleto: string;
  endereco: string;
  telefone: string;
  tipoServico: ServiceType;
  dataCadastro: string;
}

export interface ClientInput {
  nomeCompleto: string;
  endereco: string;
  telefone: string;
  tipoServico: ServiceType;
}

export interface SalesSummary {
  totalVendas: number;
  vendasInternet: number;
  vendasTV: number;
  vendasCelular: number;
  vendasCombo: number;
}
