import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Checkbox, Button, Modal, Card } from 'antd';
import { LeftOutlined, CloseOutlined } from '@ant-design/icons';
import { useCheckbox } from '../utils/useCheckbox';
import { User } from '../types';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// @ts-ignore
import { submitUsuario } from "../utils/submitUsuario";
// @ts-ignore
import { editUsuario } from '../components/editUsuario';
import { invoke } from '@tauri-apps/api/core';

// Define field types for form sections
interface BaseField {
  label: string;
  type: string;
  placeholder?: string;
}

interface InputField extends BaseField {
  type: 'input';
  name: keyof User;
  inputType?: string;
}

interface SelectField extends BaseField {
  type: 'select';
  name: keyof User;
  options: Array<{ value: string; label: string }>;
}

interface CheckboxField extends BaseField {
  type: 'checkbox';
  checked: boolean;
  toggle: (e: CheckboxChangeEvent) => void; 
  text: string;
}

interface CheckboxGroupField extends BaseField {
  type: 'checkboxGroup';
  options: Array<{
    label: string;
    checked: boolean;
    toggle: (e: CheckboxChangeEvent) => void;
  }>;
}

type FormField = InputField | SelectField | CheckboxField | CheckboxGroupField;

interface FormSection {
  title: string;
  fields: FormField[];
}

const AdicionarDados: React.FC = () => {
  
  const [dados, setDados] = useState<User>({
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
    valor_renda: '',
    moradia: '',
    moradia_valor: '',
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
    medicamentos_gasto: '',
    tratamento: '',
  
    nutri: '',
    tempo_tratamento: '',
    local: '',
    encaminhamento: '',
    solicitacoes: '',
    observacoes: '',
    motivo_desligamento: '',
    parecer_social: ''
  })

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
      dados.moradia?.trim() !== '' &&
      dados.agua?.trim() !== '' &&
      dados.energia?.trim() !== '' &&
      dados.bens?.trim() !== '' &&
      dados.desc_doenca?.trim() !== '' &&
      dados.medicamentos?.trim() !== '' &&
      dados.local?.trim() !== ''
    ) : false;

    setIsFormComplete(isComplete);
  }, [dados]);

  // resize a janela the window faz os resize esse useEffect tlg
  useEffect(() => {
    invoke('resize_current_window', { width: 800, height: 1010 })
      .then(() => console.log('Window resized successfully'))
      .catch((error) => console.error('Failed to resize window:', error));
  }, []);


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
    

    setShowModalSubmit(false);
    
    submitUsuario(dados)
    navigate('/')
    
    
  } catch (error) {
    console.error("Error submitting/editing user:", error);
    // You might want to show an error message to the user here
  }
};

// Define form sections for better organization
const formSections: FormSection[] = [
  {
    title: "Informações Financeiras",
    fields: [
      {
        label: "Fonte de renda familiar",
        type: "select",
        name: "fonte_renda",
        options: [
          { value: 'emprego-formal', label: 'emp. formal' },
          { value: 'emprego-informal', label: 'emp. informal' },
          { value: 'aposentado-invalidez', label: 'aposentado por invalidez' },
          { value: 'aposentado-contribuicao', label: 'aposentado por tempo de contribuição' },
          { value: 'pensao-morte', label: 'pensão por morte' },
          { value: 'auxilio-doenca', label: 'auxilio doença' },
          { value: 'BPC-LOAS', label: 'BPC/LOAS' },
          { value: 'bolsa-familia', label: 'bolsa familia' },
        ]
      },
      {
        label: "Valor da Renda",
        placeholder: "valor da renda",
        type: "input",
        name: "valor_renda",
        inputType: "number"
      },
      {
        label: "Valor da Moradia",
        placeholder: "valor da moradia",
        type: "input",
        name: "moradia_valor",
        inputType: "number"
      },
      {
        label: "Valor da Água",
        placeholder: "valor da água",
        type: "input",
        name: "agua_valor",
        inputType: "number"
      },
      {
        label: "Valor da Energia",
        placeholder: "valor da energia",
        type: "input",
        name: "energia_valor",
        inputType: "number"
      },
      {
        label: "Bens Possuídos",
        placeholder: "bens possuídos",
        type: "input",
        name: "bens"
      },
      
    ]
  },
  {
    title: "Serviços",
    fields: [
      {
        label: "Internet",
        type: "checkbox",
        checked: isNet,
        toggle: toggleNet,
        text: "Usuário tem acesso à internet?"
      },
      {
        label: "Tipo de Moradia",
        type: "select",
        name: "moradia",
        options: [
          { value: 'propria', label: 'Casa própria' },
          { value: 'alugada', label: 'Casa alugada' },
          { value: 'cedida', label: 'Casa cedida' },
          { value: 'financiada', label: 'Casa financiada' },
        ]
      },
      {
        label: "Tipo de Abastecimento de Água",
        type: "select",
        name: "agua",
        options: [
          { value: 'rede-publica', label: 'rede pública' },
          { value: 'poco-ou-nascente', label: 'poço ou nascente' },
          { value: 'outros', label: 'outros' },
        ]
      },
      
      {
        label: "Tipo de Abastecimento de Energia",
        type: "select",
        name: "energia",
        options: [
          { value: 'celesc', label: 'celesc' },
          { value: 'cooperativa', label: 'cooperativa' },
          { value: 'irregular', label: 'irregular' },
        ]
      },
      
      
      
    ]
  },
  {
    title: "CRAS",
    fields: [
      {
        label: "acompanhado pelo CRAS",
        type: "checkbox",
        checked: isCRAS,
        toggle: toggleCRAS,
        text: "Usuário é acompanhado pelo CRAS?"
      },
      {
        label: "Acesso ao CRAS",
        placeholder: "acesso",
        type: "input",
        name: "acesso_cras"
      }
    ]
  },
  {
    title: "Informações Médicas",
    fields: [
      {
        label: "Descrição da Doença",
        placeholder: "descrição da doença",
        type: "input",
        name: "desc_doenca"
      },
      {
        label: "Medicamentos Usados",
        placeholder:  "medicamentos usados",
        type: "input",
        name: "medicamentos"
      },
      {
        label: "Gasto com Medicamentos",
        placeholder: "gasto com medicamentos",
        type: "input",
        name: "medicamentos_gasto",
        inputType: "number"
      }
    ]
  },
  {
    title: "Tratamento",
    fields: [
      {
        label: "Tratamento Médico",
        type: "checkboxGroup",
        options: tratamentos.map((tratamento, index) => ({
          label: tratamento.charAt(0).toUpperCase() + tratamento.slice(1),
          checked: tratamentoCheckboxes[index].checked,
          toggle: tratamentoCheckboxes[index].toggle
        }))
      },
      {
        label: "Nutrição",
        type: "input",
        name: "nutri",
        placeholder: "nutri"
      },
      {
        label: "Tempo de Tratamento",
        placeholder: "tempo",
        type: "input",
        name: "tempo_tratamento"
      },
      {
        label: "Local do Tratamento",
        type: "input",
        name: "local",
        placeholder: "local"
      },
      {
        label: "Encaminhamento",
        type: "input",
        name: "encaminhamento",
        placeholder: "encaminhamento"
      }
    ]
  },
  {
    title: "Solicitações",
    fields: [
      {
        label: "Solicitações",
        type: "input",
        name: "solicitacoes",
        placeholder: "Solicitações"
      },
      {
        label: "Observações",
        type: "input",
        name: "observacoes",
        placeholder: "obs"
      },
      {
        label: "Motivo do desligamento",
        type: "input",
        name: "motivo_desligamento",
        placeholder: "(deixe em branco se não for desligado)"
      },
    ]
  },
];

  return (
    <div className="container mx-auto my-5">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
        Adicionar Dados para o Usuário
      </h1>
      
      <div className="bg-white p-4 rounded-lg w-full max-w-7xl mx-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 p-2 border-b">
          <Button type='text' icon={<LeftOutlined />} onClick={handleVoltar} />
          <h2 className="text-xl font-bold">Dados do Usuario</h2>
          <Button icon={<CloseOutlined />} onClick={() => {setShowModalExit(true)}} />
        </div>
        
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
            {formSections.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="p-4">
                <h3 className="font-semibold mb-3">{section.title}</h3>
                <div className="space-y-4">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="mb-2">
                      <label className="text-sm text-gray-500">{field.label}</label>
                      
                      {field.type === 'input' && (
                        <Input
                          name={field.name}
                          placeholder={field.placeholder}
                          type={field.inputType || "text"}
                          value={dados[field.name] !== null && dados[field.name] !== undefined ? String(dados[field.name]) : ''}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full"
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <Select
                          placeholder={field.label}
                          value={dados[field.name] as string || undefined}
                          onChange={(value) => handleSelectChange(field.name, value)}
                          className="w-full"
                          options={field.options}
                        />
                      )}
                      
                      {field.type === 'checkbox' && (
                        <Checkbox checked={field.checked} onChange={field.toggle}>
                          {field.text} {field.checked ? 'Sim' : 'Não'}
                        </Checkbox>
                      )}
                      
                      {field.type === 'checkboxGroup' && (
                        <div className="space-y-1">
                          {field.options.map((option, optionIndex) => (
                            <Checkbox
                              key={optionIndex}
                              checked={option.checked}
                              onChange={option.toggle}
                            >
                              {option.label}
                            </Checkbox>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6 p-4">
            <Button 
              type="default" 
              htmlType="submit" 
              className="bg-blue-600 text-white p-3 w-full max-w-md text-lg mb-10"
              disabled={!isFormComplete}
            >
              Enviar Dados
            </Button>
          </div>
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