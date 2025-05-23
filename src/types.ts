export interface User {
  id?: string;
  nome: string;
  ativo: number;
  cpf: string;
  rg: string | null;
  data_nasc: string;
  telefone: string;
  profissao: string | null;
  escolaridade: number;
  patologia: string;
  cep: string;
  municipio: string;
  bairro: string;
  rua: string;
  numero: string;
  referencia: string | null;
  resp_nome: string | null;
  resp_cpf: string | null;
  resp_idade: number | null;
  resp_telefone: string | null;
  resp_profissao: string | null;
  resp_escolaridade: number | null;
  resp_parentesco: string | null;
  resp_renda: string | null;
  fonte_renda: string;
  valor_renda: string;
  moradia: string;
  moradia_valor: string;
  agua: string;
  agua_valor: string;
  energia: string;
  energia_valor: string;
  bens: string;
  internet: boolean;
  cras: boolean;
  acesso_cras: string;
  desc_doenca: string;
  medicamentos: string;
  medicamentos_gasto: string;
  tratamento: string;
  nutri: string;
  tempo_tratamento: string;
  local: string;
  encaminhamento: string;
  solicitacoes: string;
  observacoes: string;
  motivo_desligamento: string;
  parecer_social: string;
  operador_id: string;
}

export const escolaridades = ['ensino fundamental incompleto',
  'ensino fundamental completo','ensino medio incompleto','ensino medio completo',
  'ensino superior incompleto','ensino superior completo']

