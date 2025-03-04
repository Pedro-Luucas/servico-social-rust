import { invoke } from '@tauri-apps/api/core';
import { User } from '../types';

/**
 * Submits a user to the backend via Tauri's invoke command
 * Maps and formats frontend data to match backend CreateUsuarioDto
 */
export const submitUsuario = async (userData: User): Promise<void> => {
  try {
    // Format numeric fields to proper types
    // This ensures string numbers are converted to actual numbers
    const formattedData = {
      ...userData,
      nome: userData.nome,
      ativo: userData.ativo,
      cpf: userData.cpf,
      rg: userData.rg,
      data_nasc: userData.data_nasc,
      telefone: userData.telefone,
      profissao: userData.profissao,
      escolaridade: userData.escolaridade,
      patologia: userData.patologia,
      cep: userData.cep,
      municipio: userData.municipio,
      bairro: userData.bairro,
      rua: userData.rua,
      numero: userData.numero,
      referencia: userData.referencia,
      resp_nome: userData.resp_nome,
      resp_cpf: userData.resp_cpf,
      resp_idade: userData.resp_idade,
      resp_telefone: userData.resp_telefone,
      resp_profissao: userData.resp_profissao,
      resp_escolaridade: userData.resp_escolaridade,
      resp_parentesco: userData.resp_parentesco,
      resp_renda: userData.resp_renda,
      fonte_renda: userData.fonte_renda,
      
      moradia: userData.moradia,
      agua: userData.agua,
      
      energia: userData.energia,

      bens: userData.bens,
      internet: userData.internet,
      cras: userData.cras,
      acesso_cras: userData.acesso_cras,
      desc_doenca: userData.desc_doenca,
      medicamentos: userData.medicamentos,

      tratamento: userData.tratamento,
      nutri: userData.nutri,
      tempo_tratamento: userData.tempo_tratamento,
      local: userData.local,
      encaminhamento: userData.encaminhamento,
      solicitacoes: userData.solicitacoes,
      motivo_desligamento: userData.motivo_desligamento,
      parecer_social: userData.parecer_social,

      valor_renda: userData.valor_renda !== '' ? Number(userData.valor_renda) : null,
      moradia_valor: userData.moradia_valor !== '' ? Number(userData.moradia_valor) : null,
      agua_valor: userData.agua_valor !== '' ? Number(userData.agua_valor) : null,
      energia_valor: userData.energia_valor !== '' ? Number(userData.energia_valor) : null,
      medicamentos_gasto: userData.medicamentos_gasto !== '' ? Number(userData.medicamentos_gasto) : null,

      
      // Set a default operator ID if needed (customize as needed)
      operador_id: 0, // test
      // userData.operador_id || sessionStorage.getItem('operadorId') ? 
      //  Number(sessionStorage.getItem('operadorId')) : 
      //  null
    };

    console.log('Submitting user data:', formattedData);
    
    // Call the Rust backend to create the user
    const result = await invoke('create_usuario', { dto: formattedData });
    console.log('Usuario created successfully:', result);
    
    
  } catch (error) {
    console.error('Error submitting user:', error);
    throw error; // Re-throw to let the caller handle the error
  }
};