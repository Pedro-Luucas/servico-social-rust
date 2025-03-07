import { useEffect, useState } from 'react';
import { Card, Spin, Alert, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { escolaridades } from '../types';
import { HomeOutlined, LeftOutlined } from '@ant-design/icons';
import { pesquisar } from '../utils/pesquisar';
import { invoke } from '@tauri-apps/api/core';

const DetalhesUsuario = () => {
  const { id } = useParams(); // Captura o ID da URL
  const navigate = useNavigate(); // Para navegação
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    {
      title: 'Informações Pessoais',
      fields: [
        { key: 'nome', label: 'Nome' },
        { key: 'cpf', label: 'CPF' },
        { key: 'rg', label: 'RG' },
        { key: 'data_nasc', label: 'Data de Nascimento' },
        { key: 'telefone', label: 'Telefone' },
        { key: 'patologia', label: 'Patologia' }
      ]
    },
    {
      title: 'Localização',
      fields: [
        { key: 'municipio', label: 'Município' },
        { key: 'bairro', label: 'Bairro' },
        { key: 'rua', label: 'Rua' },
        { key: 'numero', label: 'Número' },
        { key: 'cep', label: 'CEP' }
      ]
    },
    {
      title: 'Responsável',
      fields: [
        { key: 'resp_nome', label: 'Nome do responsavel' },
        { key: 'resp_cpf', label: 'CPF do responsavel' },
        { key: 'resp_idade', label: 'Idade do responsavel' },
        { key: 'resp_telefone', label: 'Telefone do responsavel' },
        { key: 'resp_profissao', label: 'Profissão do responsavel' },
        { key: 'resp_parentesco', label: 'Parentesco'}
      ]
    },
    {
      title: 'Financeiro',
      fields: [
        { key: 'profissao', label: 'Profissão' },
        { key: 'escolaridade', label: 'Escolaridade' },
        
        { key: 'fonte_renda', label: 'Fonte de Renda' },
        { key: 'valor_renda', label: 'Valor da Renda' },
        { key: 'moradia_valor', label: 'Valor da Moradia' },
        { key: 'agua_valor', label: 'Valor da Água' },
        { key: 'energia_valor', label: 'Valor da Energia' },
      ]
    },
    {
      title: 'Tratamento',
      fields: [
        
        { key: 'tratamento', label: 'Tratamento' },
        
        { key: 'tempo_tratamento', label: 'Duração do Tratamento' },
        { key: 'local', label: 'Local do tratamento' },
        { key: 'encaminhamento', label: 'Encaminhamento' },
        
        
      ]
    },
    {
      title: 'Saúde',
      fields: [
        { key: 'desc_doenca', label: 'Descrição da Doença' },
        { key: 'medicamentos', label: 'Medicamentos' },
        { key: 'medicamentos_gasto', label: 'Gasto com Medicamentos' },
      ]
    },
    {
      title: 'Acesso',
      fields: [
        { key: 'internet', label: 'Internet' },
        { key: 'agua', label: 'Água' },
        { key: 'energia', label: 'Energia' },
        { key: 'moradia', label: 'Moradia' }
      ]
      
    },
    {
      title: 'CRAS',
      fields: [
        { key: 'cras', label: 'CRAS' },
        { key: 'acesso_cras', label: 'Acesso CRAS' }
      ]
      
    },
    {
      title: 'Solicitações',
      fields: [
        { key: 'solicitacoes', label: 'Solicitações' },
        { key: 'observacoes', label: 'Observações' },
        { key: 'motivo_desligamento', label: 'Motivo do desligamento' }
      ]
      
    }
  ];

  useEffect(() => {
    // Get screen dimensions and resize window to percentages
    invoke('get_screen_size')
      .then((screenSize: any) => {
        const width = screenSize.width * 0.65; 
        const height = screenSize.height * 0.8; 
        
        return invoke('resize_current_window', { width, height });
      })
      .then(() => console.log('Window resized successfully'))
      .catch((error) => console.error('Failed to resize window:', error));
  }, []);

  // Busca os dados do usuário pelo ID
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await pesquisar('id', id as string);
        setData(data);
      } catch (err: any) {
        setError('Erro ao carregar os detalhes do usuário. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Conteúdo de erro, carregamento ou exibição dos dados
  return (
    <div>
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-auto">
        <div className="top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalhes do Usuário</h2>
              <div className="self-start">
                {/* ATIVO INATIVO OU ÓBITO */}

                  {/* Botão para voltar */}
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate(-1)}
                className="self-start"
              >
                Voltar
              </Button>

              {/* Botão para ir para a página inicial */}
              <Button
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                className="ml-3"
              >
                Início
              </Button>
            </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert message={error} type="error" showIcon />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {columns.map((column, idx) => (
              <Card key={idx} className="p-4">
                <h3 className="font-semibold mb-3">{column.title}</h3>
                <div className="space-y-2">
                  {column.fields.map((field) => (
                    <div key={field.key}>
                      <span className="text-sm text-gray-500">{field.label}</span>
                      <p className="font-medium break-words">
                      {field.key === 'escolaridade'
                        ? escolaridades[data[field.key]]
                        : field.key === 'data_nasc'
                        ? data[field.key]?.slice(0, 10) 
                        : typeof data[field.key] === 'boolean'
                        ? data[field.key]
                          ? 'Sim'
                          : 'Não'
                        : data[field.key] || '-'}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalhesUsuario;
