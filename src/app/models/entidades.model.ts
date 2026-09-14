export const UFS_VALIDAS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;
export type UF = typeof UFS_VALIDAS[number];

export interface Endereco {
  id: string;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  estado: UF;
  pais: string;
}

export type NovoEndereco = Omit<Endereco, 'id' | 'complemento' | 'pais'> & {
  complemento?: string;
  pais?: string;
};

export const ESTADOS_CIVIS_VALIDOS = [
  'Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'Separado(a) Legalmente', 'União Estável'
] as const;
export type EstadoCivil = typeof ESTADOS_CIVIS_VALIDOS[number];

export interface Pessoa {
  id: string;
  enderecoId: string;
  nome: string;
  telefone: string;
  email: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  ufEmissorRg: string;
  estadoCivil: EstadoCivil;
  nacionalidade: string;
}

export type NovaPessoa = Omit<Pessoa, 'id'>;

export const TIPOS_IMOVEL_VALIDOS = [
  'casa', 'apartamento', 'apartamento em condominio', 'casa comercial', 'casa em condominio',
  'cobertura', 'chacara', 'edicula', 'fazenda', 'flat', 'galpão', 'garagem', 'hotel', 'kitnet',
  'loft', 'prédio', 'ponto comercial', 'sala comercial', 'sitio', 'studio', 'terreno', 'consultorio'
] as const;
export type TipoImovel = typeof TIPOS_IMOVEL_VALIDOS[number];

export interface Imovel {
  id: string;
  enderecoId: string;
  proprietarioId: string;
  tipo: TipoImovel;
  condominio: string | null;
  codigoAgua: string | null;
  codigoEnergia: string | null;
  codigoIptu: string | null;
  numeroRegistro: string | null;
}

export type NovoImovel = Omit<Imovel, 'id' | 'condominio' | 'codigoAgua' | 'codigoEnergia' | 'codigoIptu' | 'numeroRegistro'> & {
  condominio?: string;
  codigoAgua?: string;
  codigoEnergia?: string;
  codigoIptu?: string;
  numeroRegistro?: string;
};

export const TIPOS_LOCACAO_VALIDOS = [
  'Residencial', 'Nao residencial', 'Comercial', 'Industrial',
  'Temporada', 'Mista', 'Arrendamento Rural', 'Parceria Rural'
] as const;
export type TipoLocacao = typeof TIPOS_LOCACAO_VALIDOS[number];

export const GARANTIAS_VALIDAS = ['Caução', 'Fiador', 'Seguro Fiança'] as const;
export type Garantia = typeof GARANTIAS_VALIDAS[number];

export const STATUS_CONTRATO_VALIDOS = ['ativo', 'encerrado'] as const;
export type StatusContrato = typeof STATUS_CONTRATO_VALIDOS[number];

export interface Contrato {
  id: string;
  imovelId: string;
  inquilinoId: string;
  destinatarioId: string;
  tipoLocacao: TipoLocacao;
  garantia: Garantia;
  dataInicio: string;
  duracaoMeses: number;
  dataFim: string;
  valorAluguel: string;
  taxaAdministracao: string;
  diaVencimento: number;
  proximoReajuste: string;
  acrescimoInquilino: string;
  admAcrescimoInquilino: string;
  descontoInquilino: string;
  admDescontoInquilino: string;
  acrescimoProprietario: string;
  descontoProprietario: string;
  iptu: string;
  iptuProprietario: string;
  condominio: string;
  condominioProprietario: string;
  seguroFianca: string;
  seguroIncendio: string;
  parcelaCaucao: string;
  observacoes: string | null;
  pix: string | null;
  agenciaConta: string | null;
  retirada: boolean;
  ativo: StatusContrato;
}

export type NovoContrato = Omit<Contrato, 'id' | 'observacoes' | 'pix' | 'agenciaConta' | 'ativo'> & {
  observacoes?: string;
  pix?: string;
  agenciaConta?: string;
  ativo?: StatusContrato;
};
