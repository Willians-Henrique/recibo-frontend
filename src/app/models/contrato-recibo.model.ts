export interface ContratoResumo {
  id: string;
  inquilinoId: string;
  inquilinoNome: string;
  proprietarioNome: string;
  endereco: EnderecoRecibo;
}

export interface EnderecoRecibo {
  id: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}

export interface PessoaRecibo {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  endereco?: EnderecoRecibo;
}

export interface ImovelRecibo {
  id: string;
  tipo: string;
  condominio: string | null;
  endereco: EnderecoRecibo;
  proprietario: PessoaRecibo;
}

export interface ContratoRecibo {
  id: string;
  tipoLocacao?: string;
  garantia?: string;
  dataInicio: string;
  duracaoMeses?: number;
  dataFim?: string;
  valorAluguel: string;
  taxaAdministracao: string;
  diaVencimento?: number;
  proximoReajuste?: string;
  acrescimoInquilino?: string;
  admAcrescimoInquilino?: string;
  descontoInquilino?: string;
  admDescontoInquilino?: string;
  acrescimoProprietario?: string;
  descontoProprietario?: string;
  iptu?: string;
  iptuProprietario?: string;
  condominio?: string;
  condominioProprietario?: string;
  seguroFianca?: string;
  seguroIncendio?: string;
  parcelaCaucao?: string;
  observacoes?: string | null;
  pix?: string | null;
  agenciaConta?: string | null;
  retirada?: boolean;
  ativo?: string;
  imovel: ImovelRecibo;
  inquilino: PessoaRecibo;
  destinatario: PessoaRecibo;
}
