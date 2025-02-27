import { invoke } from '@tauri-apps/api/core';

export const pesquisar = async (tipo: string, query: string) => {
  const commands: { [key: string]: string } = {
    nome: 'get_usuario_by_nome',
    telefone: 'get_usuario_by_telefone',
    cpf: 'get_usuario_by_cpf',
    cep: 'get_usuario_by_cep',
    id: 'get_usuario_by_id'
  };

  const command = commands[tipo];
  
  if (!command) {
    throw new Error(`Tipo de pesquisa inválido: ${tipo}`);
  }

  try {
    // For get_usuario_by_id, we pass the parameter as 'id'
    // For others, we use the tipo as parameter name
    const params = tipo === 'id' 
      ? { id: query } 
      : { [tipo]: query };
    
    return await invoke(command, params);
  } catch (error) {
    console.error(`Erro ao pesquisar por ${tipo}:`, error);
    throw error;
  }
};