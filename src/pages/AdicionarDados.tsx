import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Checkbox, Button, List, Card, Modal } from 'antd';
import { LeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useCheckbox } from '../utils/useCheckbox';
import { User } from '../types';
// @ts-ignore
import { submitUsuario } from "../components/submitUsuario";
// @ts-ignore
import { editUsuario } from '../components/editUsuario';


const AdicionarDados: React.FC = () => {
  

  const [dados, setDados] = useState<User>({
    nome: '',
    ativo: 0,
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
    parecer_social: '',
  });

  const [isFormComplete, setIsFormComplete] = useState(false);
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false); // Estado para controlar a montagem

  // Carrega formData do sessionStorage na montagem
  useEffect(() => {
    const storedFormData = sessionStorage.getItem('formData');
    if (storedFormData) {
      try {
        const formData = JSON.parse(storedFormData);
        if (formData) {
          setDados(formData);
          console.log('Dados carregados:', formData);
        }
      } catch (error) {
        console.error('Error parsing formData:', error);
      }
    }
    setIsMounted(true);
  }, []);

  // Salva formData no sessionStorage
  useEffect(() => {
    if (isMounted && dados) {
      try {
        sessionStorage.setItem('formData', JSON.stringify(dados));
        console.log('Salvando dados:', dados);
      } catch (error) {
        console.error('Error saving formData:', error);
      }
    }
  }, [dados, isMounted]);

  // Verifica se o formulário está completo toda vez que formData mudar
  useEffect(() => {
    const isComplete = dados ? (
      dados.fonte_renda?.trim() !== '' &&
      dados.valor_renda > 0 &&
      dados.moradia?.trim() !== '' &&
      dados.agua?.trim() !== '' &&
      dados.energia?.trim() !== '' &&
      dados.bens?.trim() !== '' &&
      dados.desc_doenca?.trim() !== '' &&
      dados.medicamentos?.trim() !== '' &&
      dados.medicamentos_gasto > 0 &&
      dados.local?.trim() !== ''
    ) : false;

    setIsFormComplete(isComplete);
  }, [dados]);




//------------------------------------CHECKBOXES------------------------------------

  const { checked: isCRAS, toggle: toggleCRAS, setChecked: setIsCRAS } = useCheckbox({
    initialState: false,
    onChange: (newValue) => {
      setDados(prev => ({
        ...prev,
        cras: newValue
      }));
    }
  });
  const { checked: isNet, toggle: toggleNet, setChecked: setIsNet } = useCheckbox({
    initialState: false,
    onChange: (newValue) => {
      setDados(prev => ({
        ...prev,
        internet: newValue
      }));
    }
  });

//TRATAMENTO
  const tratamentos = [
    'quimioterapia', 
    'radioterapia', 
    'acompanhamento paliativo'
  ];
  
  const tratamentoCheckboxes = tratamentos.map(tratamento => 
    useCheckbox({
      onChange: (checked) => {
        handleTratamentoChange(tratamento, checked);
      }
    })
  );

// Add this useEffect to check treatment checkboxes
  useEffect(() => {
    if (dados?.tratamento) {
      const selectedTratamentos = dados.tratamento.split(', ');
      tratamentos.forEach((tratamento, index) => {
        tratamentoCheckboxes[index].setChecked(selectedTratamentos.includes(tratamento));
      });
    }
  }, [dados?.tratamento]);


  const handleTratamentoChange = (tratamento: string, checked: boolean) => {
    if (!dados) return;
    setDados((prevState) => {
      if (!prevState) return prevState;
      const tratamentosAtuais = prevState.tratamento 
        ? prevState.tratamento.split(', ').filter(t => t.trim() !== '')
        : [];

      const novosTratamentos = checked
        ? [...tratamentosAtuais, tratamento]
        : tratamentosAtuais.filter((t) => t !== tratamento);

      return { 
        ...prevState, 
        tratamento: novosTratamentos.length > 0 
          ? novosTratamentos.join(', ') 
          : '' 
      };
    });
  };

//useEffect para checar as checkboxes
  useEffect(() => {
    if (dados) {
      setIsCRAS(dados.cras ?? false);
      setIsNet(dados.internet ?? false);
    }
  }, [dados]);




//HANDLE AS COISA
  //modal de aviso
  const [showModalExit, setShowModalExit] = useState(false);
  const backHome = () => {
    setShowModalExit(false)
    navigate("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dados) return;
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSelectChange = (name: keyof User, value: string) => {
    if (!dados) return;
    setDados({ ...dados, [name]: value });
  };

  const handleVoltar = () => {
    navigate('/cadastro-usuario')
  };
//SUBMIT---------------------

const [showModalSubmit, setShowModalSubmit] = useState(false);

const openModalSubmit = () => {
  setShowModalSubmit(true);
};

const closeModalSubmit = () => {
  setShowModalSubmit(false);
};

const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  openModalSubmit();
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const isEditing = sessionStorage.getItem("edit") === "true";
    
    if (isEditing) {
      setShowModalSubmit(false);
      const result = await editUsuario();
      navigate('/pesquisa')
    } else {
      setShowModalSubmit(false);
      const result = await submitUsuario();
      navigate('/')
    }
    
  } catch (error) {
    console.error("Error submitting/editing user:", error);
    // You might want to show an error message to the user here
  }
};


  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
        Adicionar Dados para o Usuário
      </h1>
      <div className="max-w-3xl mx-auto mb-10 bg-white p-6 rounded-lg shadow-md ">
        <div className="flex flex-row justify-between mx-8">
          <Button type='text' icon={<LeftOutlined />} onClick={handleVoltar} />
          <Button icon={<CloseOutlined />} onClick={() => {setShowModalExit(true)}} className='self-start' />
        </div>
        

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Fonte de Renda */}
          <div className="flex flex-col">
            <label className="text-lg">Fonte de renda familiar</label>
            <Select
              placeholder="Fonte de Renda"
              value={dados.fonte_renda}
              onChange={(value) => handleSelectChange('fonte_renda', value)}
              className="w-full"
              options={[
                { value: 'emprego-formal', label: 'emp. formal' },
                { value: 'emprego-informal', label: 'emp. informal' },
                { value: 'aposentado-invalidez', label: 'aposentado por invalidez' },
                { value: 'aposentado-contribuicao', label: 'aposentado por tempo de contribuição' },
                { value: 'pensao-morte', label: 'pensão por morte' },
                { value: 'auxilio-doenca', label: 'auxilio doença' },
                { value: 'BPC-LOAS', label: 'BPC/LOAS' },
                { value: 'bolsa-familia', label: 'bolsa familia' },
              ]}
            />
          </div>

          {/* Valor da Renda */}
          <div className="flex flex-col">
            <label className="text-lg">Valor da Renda</label>
            <Input
              name="valor_renda"
              placeholder="Valor da Renda"
              type="number"
              value={dados.valor_renda}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Moradia */}
          <div className="flex flex-col">
            <label className="text-lg">Tipo de Moradia</label>
            <Select
              placeholder="Moradia"
              onChange={(value) => handleSelectChange('moradia', value)}
              className="w-full"
              value={dados.moradia || undefined} 
              options={[
                { value: 'propria', label: 'Casa própria' },
                { value: 'alugada', label: 'Casa alugada' },
                { value: 'cedida', label: 'Casa cedida' },
                { value: 'financiada', label: 'Casa financiada' },
              ]}
            />
          </div>

          {/* Água */}
          <div className="flex flex-col">
            <label className="text-lg">Tipo de Abastecimento de Água</label>
            <Select
              placeholder="Tipo de Abastecimento de Água"
              onChange={(value) => handleSelectChange('agua', value)}
              className="w-full"
              value={dados.agua || undefined} 
              options={[
                { value: 'rede-publica', label: 'rede pública' },
                { value: 'poco-ou-nascente', label: 'poço ou nascente' },
                { value: 'outros', label: 'outros' },
              ]}
            />
          </div>

          {/* Energia */}
          <div className="flex flex-col">
            <label className="text-lg">Tipo de Abastecimento de Energia</label>
            <Select
              placeholder="Tipo de Abastecimento de Energia"
              onChange={(value) => handleSelectChange('energia', value)}
              className="w-full"
              value={dados.energia || undefined} 
              options={[
                { value: 'celesc', label: 'celesc' },
                { value: 'cooperativa', label: 'cooperativa' },
                { value: 'irregular', label: 'irregular' },
              ]}
            />
          </div>

          {/* Bens */}
          <div className="flex flex-col">
            <label className="text-lg">Bens Possuídos</label>
            <Input
              name="bens"
              placeholder="Bens Possuídos"
              value={dados.bens}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* CRAS Section */}
          <div className="flex flex-col">
            <label className="text-lg">CRAS</label>
            <Checkbox checked={isCRAS} onChange={toggleCRAS}>
              Usuário é acompanhado pelo CRAS? {isCRAS ? 'Sim' : 'Não'}
            </Checkbox>
            
            <label className="text-lg mt-2">Acesso ao CRAS</label>
            <Input
              name="acesso_cras"
              placeholder="Acesso ao CRAS"
              value={dados.acesso_cras}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Internet */}
          <div className="flex flex-col">
            <label className="text-lg">Internet</label>
            <Checkbox checked={isNet} onChange={toggleNet}>
              Usuário tem acesso à internet? {isNet ? 'Sim' : 'Não'}
            </Checkbox>
          </div>

          {/* Doenças */}
          <div className="flex flex-col">
            <label className="text-lg">Descrição da Doença</label>
            <Input
              name="desc_doenca"
              placeholder="Descrição da Doença"
              value={dados.desc_doenca}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Medicamentos */}
          <div className="flex flex-col">
            <label className="text-lg">Medicamentos Usados</label>
            <Input
              name="medicamentos"
              placeholder="Medicamentos Usados"
              value={dados.medicamentos}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Gastos com Medicamentos */}
          <div className="flex flex-col">
            <label className="text-lg">Gasto com Medicamentos</label>
            <Input
              name="medicamentos_gasto"
              placeholder="Gasto com Medicamentos"
              type="number"
              value={dados.medicamentos_gasto}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Tratamento */}
          <div className="flex flex-col">
            <label className="text-lg">Tratamento Médico</label>
            {tratamentos.map((tratamento, index) => (
              <Checkbox
                key={tratamento}
                checked={tratamentoCheckboxes[index].checked}
                onChange={tratamentoCheckboxes[index].toggle}
              >
                {tratamento.charAt(0).toUpperCase() + tratamento.slice(1)}
              </Checkbox>
            ))}
          </div>

          {/* Nutrição */}
          <div className="flex flex-col">
            <label className="text-lg">Nutrição</label>
            <Input
              name="nutri"
              placeholder="Nutrição"
              value={dados.nutri}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Tempo de Tratamento */}
          <div className="flex flex-col">
            <label className="text-lg">Tempo de Tratamento</label>
            <Input
              name="tempo_tratamento"
              placeholder="Tempo de Tratamento"
              value={dados.tempo_tratamento}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Local de Tratamento */}
          <div className="flex flex-col">
            <label className="text-lg">Local do Tratamento</label>
            <Input
              name="local"
              placeholder="Local do Tratamento"
              value={dados.local}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Encaminhamento */}
          <div className="flex flex-col">
            <label className="text-lg">Encaminhamento</label>
            <Input
              name="encaminhamento"
              placeholder="Encaminhamento"
              value={dados.encaminhamento}
              onChange={handleInputChange}
              className="border rounded p-2 w-full text-lg"
            />
          </div>

          {/* Botão de Envio */}
          <Button 
            type="default" 
            htmlType="submit" 
            className="md:col-span-2 bg-blue-600 text-white p-3 md:p-6 w-full text-lg rounded mt-5"
            disabled={!isFormComplete}
          >
            Enviar Dados
          </Button>
        </form>
     

            <Modal
                  title="Voltar à pagina inicial?"
                  open={showModalExit}
                  onOk={backHome}
                  onCancel={() => {setShowModalExit(false)}}
                  okText="Ok"
                  cancelText="Cancelar"
                >
                  <h1>As alterações não serão salvas! </h1>
            </Modal>

            <Modal
              title={sessionStorage.getItem("edit") === "true" ? "Editar dados" : "Enviar dados"}
              open={showModalSubmit}
              onOk={handleSubmit}
              onCancel={closeModalSubmit}
              okText="Confirmar"
              cancelText="Cancelar"
            >
              <p>Tem certeza de que deseja {sessionStorage.getItem("edit") === "true" ? "editar" : "enviar"} os dados?</p>
            </Modal>
      
      </div>
    </div>
  );
};

export default AdicionarDados;
