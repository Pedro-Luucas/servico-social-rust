import React, { useEffect, useState, useCallback } from 'react';
import { DatePicker, Input, Select, Button, Radio, Modal } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { LeftOutlined } from '@ant-design/icons';
import EnderecoModal from '../components/EnderecoModal';
import ResponsavelModal from '../components/ResponsavelModal';
import { User } from '../types';

interface UserFormProps {
  onSubmit: (user: User) => void;
  initialData?: User;
}

const initialUserState: User = {
  nome: '',
  ativo: 1,
  cpf: '',
  rg: null,
  data_nasc: '',
  telefone: '',
  profissao: null,
  escolaridade: 0,
  patologia: '',
  cep: '',
  municipio: '',
  bairro: '',
  rua: '',
  numero: '',
  referencia: null,
  resp_nome: null,

  resp_cpf: null,
  resp_idade: null,
  resp_telefone: null,
  resp_profissao: null,
  resp_escolaridade: null,
  resp_parentesco: null,
  resp_renda: null,
  fonte_renda: '',
  valor_renda: 0,
  moradia: '',
  agua: '',
  agua_valor: '',
  energia: '',
  energia_valor: '',
  bens: '',
  internet: false,
  cras: false,
  acesso_cras: '',
  desc_doenca: '',
  medicamentos: '',
  medicamentos_gasto: 0,
  tratamento: '',

  nutri: '',
  tempo_tratamento: '',
  local: '',
  encaminhamento: '',
  solicitacoes: '',
  motivo_desligamento: '',
  parecer_social: ''
};

const escolaridadeOptions = [
  { value: 0, label: 'Ensino fundamental incompleto' },
  { value: 1, label: 'Ensino fundamental completo' },
  { value: 2, label: 'Ensino médio incompleto' },
  { value: 3, label: 'Ensino médio completo' },
  { value: 4, label: 'Ensino superior incompleto' },
  { value: 5, label: 'Ensino superior completo' },
];

const CadastroUsuario: React.FC<UserFormProps> = ({ onSubmit, initialData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User>(() => {
    try {
      const storedData = sessionStorage.getItem('formData');
      return storedData ? JSON.parse(storedData) : initialData || initialUserState;
    } catch {
      return initialData || initialUserState;
    }
  });

  const [showModals, setShowModals] = useState({
    exit: false,
    endereco: false,
    responsavel: false,
  });

  const [dataNasc, setDataNasc] = useState<Dayjs | undefined>(
    formData.dataNasc ? dayjs(formData.dataNasc) : undefined
  );

  const handleToggleModal = useCallback((modal: keyof typeof showModals, value: boolean) => {
    setShowModals(prev => ({ ...prev, [modal]: value }));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const isFormComplete = Boolean(
    formData.nome.trim() &&
    formData.cpf.trim() &&
    formData.dataNasc &&
    formData.telefone.trim() &&
    formData.escolaridade !== undefined &&
    formData.patologia.trim() &&
    formData.cep?.trim() &&
    formData.respNome?.trim()
  );


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: User) => ({ ...prev, [name]: value }));
  }, []);

  const handleDate = useCallback((date: Dayjs | null) => {
    if (!date) return;
    setDataNasc(date);
    setFormData((prev: User) => ({ ...prev, dataNasc: date.toISOString() }));
  }, []);

  const handleSelectChange = useCallback((name: keyof User, value: unknown) => {
    setFormData((prev: User) => ({ ...prev, [name]: value }));
  }, []);

  const handleEnderecoSubmit = useCallback((enderecoData: {
    cep: string;
    municipio: string;
    bairro: string;
    rua: string;
    numero: string;
    referencia: string | null;

  }) => {
    setFormData((prev: User) => ({
      ...prev,
      cep: enderecoData.cep,
      municipio: enderecoData.municipio,
      bairro: enderecoData.bairro,
      rua: enderecoData.rua,
      numero: enderecoData.numero,
      referencia: enderecoData.referencia
    }));
    handleToggleModal('endereco', false);
  }, [handleToggleModal]);

  const handleResponsavelSubmit = useCallback((responsavelData: {
    nome: string | null;
    cpf: string | null;
    idade: number | null;
    telefone: string | null;
    profissao: string | null;
    escolaridade: number | null;
    parentesco: string | null;
    renda: string | null;
  }) => {
    setFormData((prev: User) => ({
      ...prev,
      respNome: responsavelData.nome,
      respCpf: responsavelData.cpf,
      respIdade: responsavelData.idade,
      respTelefone: responsavelData.telefone,
      respProfissao: responsavelData.profissao,
      respEscolaridade: responsavelData.escolaridade,
      respParentesco: responsavelData.parentesco,
      respRenda: responsavelData.renda
    }));
    handleToggleModal('responsavel', false);
  }, [handleToggleModal]);

  const renderField = (label: string, name: keyof User, required = false) => (
    <div className="flex flex-col">
      <label className="text-lg">{label}{required && '*'}</label>
      <Input
        name={name as string}
        placeholder={label}
        value={formData[name]}
        onChange={handleChange}
        className="border rounded p-2 md:p-4 w-full text-lg"
      />
    </div>

    
  );return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">Serviço Social</h1>
      <h1 className="md:text-2xl font-bold mb-4 md:mb-4 text-center">Cadastrar Usuário</h1>
      
      <div className="max-w-3xl mx-auto bg-white p-6">
        <div className="flex justify-between mx-8">
          <Button icon={<LeftOutlined />} onClick={() => handleToggleModal('exit', true)} />
        </div>

        <form onSubmit={e => { e.preventDefault(); onSubmit(formData); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField('Nome', 'nome', true)}
          {renderField('Telefone', 'telefone', true)}
          {renderField('RG', 'rg')}
          
          <div className="flex flex-col">
            <label className="text-lg">Data de nascimento*</label>
            <DatePicker
              value={dataNasc}
              onChange={handleDate}
              className="border rounded p-2 md:p-4 w-full text-lg"
              popupClassName="date-picker-dropdown"
            />
          </div>

          {renderField('CPF', 'cpf', true)}
          {renderField('Profissão', 'profissao')}

          <div className="flex flex-col">
            <label className="text-lg">Escolaridade*</label>
            <Select
              value={formData.escolaridade}
              onChange={v => handleSelectChange('escolaridade', v)}
              options={escolaridadeOptions}
              className="w-full text-lg"
             
            />
          </div>

          {renderField('Patologia', 'patologia', true)}

          <Button
            type="primary"
            onClick={() => handleToggleModal('responsavel', true)}
            className="md:col-span-2 bg-blue-500 text-white p-2 md:p-4 w-full text-lg rounded"
          >
            Adicionar Responsável
          </Button>

          <Button
            type="primary"
            onClick={() => handleToggleModal('endereco', true)}
            className="md:col-span-2 bg-blue-500 text-white p-2 md:p-4 w-full text-lg rounded"
          >
            Adicionar Endereço
          </Button>

          <Button
            type="primary"
            onClick={() => {navigate('/parecer-social')}}
            className="md:col-span-2 bg-blue-500 text-white p-2 md:p-4 w-full text-lg rounded"
          >
            Adicionar Parecer Social
          </Button>

          <div className="md:col-span-2 my-5">
            <h1 className="text-2xl font-bold mb-4 text-center">Situação do Usuário</h1>
            <Radio.Group
              value={formData.ativo}
              onChange={e => handleSelectChange('ativo', e.target.value)}
              className="w-full flex justify-around"
            >
              <Radio value={0}>Ativo</Radio>
              <Radio value={1}>Inativo</Radio>
              <Radio value={2}>Óbito</Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            className="md:col-span-2 bg-blue-500 text-white p-2 md:p-4 w-full text-lg rounded hover:bg-yellow-700"
            disabled={!isFormComplete}
          >
            <Link to="/adicionar-dados" className="w-full block">Adicionar Dados</Link>
          </Button>

          
        </form>

        <EnderecoModal
          open={showModals.endereco}
          onClose={() => handleToggleModal('endereco', false)}
          onSave={handleEnderecoSubmit}
          initialData={{
            cep: formData.cep,
            municipio: formData.municipio,
            bairro: formData.bairro,
            rua: formData.rua,
            numero: formData.numero,
            referencia: formData.referencia

          }}
        />

        <ResponsavelModal
          open={showModals.responsavel}
          onClose={() => handleToggleModal('responsavel', false)}
          onSave={handleResponsavelSubmit}
          initialData={{
            nome: formData.resp_nome,
            cpf: formData.resp_cpf,
            idade: formData.resp_idade,
            telefone: formData.resp_telefone,
            profissao: formData.resp_profissao,
            escolaridade: formData.resp_escolaridade,
            parentesco: formData.resp_parentesco,
            renda: formData.resp_renda
          }}
        />

        <Modal
          title="Voltar à página inicial?"
          open={showModals.exit}
          onOk={() => navigate("/")}
          onCancel={() => handleToggleModal('exit', false)}
          okText="Confirmar"
          cancelText="Cancelar"
        >
          <p>Todas as alterações não salvas serão perdidas!</p>
        </Modal>
      </div>
    </div>
  );
};

export default React.memo(CadastroUsuario);