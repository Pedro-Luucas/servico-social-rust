import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Card, Typography, List, Alert } from 'antd';
import { escolaridades, User } from '../types';
import { DiffOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { pesquisar } from '../utils/pesquisar';

const { Text } = Typography;

const PesquisaUsuario: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tipoPesquisa, setTipoPesquisa] = useState('nome');
  const [responseData, setResponseData] = useState<any>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let navigate = useNavigate();

  useEffect(() => {
    const query = sessionStorage.getItem('searchQuery')
    if(query){
      setSearch(query)
    }
  },[])
  
  useEffect(() => {
    sessionStorage.setItem('searchQuery', search)
  },[search])

  // resize a janela the window faz os resize esse useEffect tlg
  useEffect(() => {

    invoke('resize_current_window', { width: 1250, height: 650 })
      .then(() => console.log('Window resized successfully'))
      .catch((error) => console.error('Failed to resize window:', error));
  }, []);
  

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    if (search.length > 2) {
      try {
        const data = await pesquisar(tipoPesquisa, search);
        setResponseData(data);
      } catch (err: any) {
        if (err.message === 'Nenhum resultado encontrado para a pesquisa.') {
          setError(err.message);
        } else {
          setError('Erro ao buscar dados. Tente novamente mais tarde.');
        }
        console.error(err);
      } finally {
        setAlertVisible(false);
        setLoading(false);
      }
    } else {
      setAlertVisible(true);
      setLoading(false);
    }
  };

//MODAL DE AVISO
  const backHome = () => {
    sessionStorage.removeItem('searchQuery')
    navigate("/")
  }

//DETALHES USUARIO
  const detalhes = (id: string | undefined) => {
    if(id){
    console.log(id, 'ID UUID')
    navigate("/detalhes/"+id)
    }
  }
  
  const editarUsuario = (user: User) => {
    if(user) {
      sessionStorage.setItem('edit', 'true')
      sessionStorage.setItem('formData', JSON.stringify(user))
      navigate('/cadastro-usuario')
    }
  }

  const adicionarRegistroAtendimento = (id: string | undefined) => {
    if(id) {
      navigate('/registro-atendimento/'+id)
    }
  }

  const anexarDocumentos = (id: string | undefined) => {
    if(id) {
      navigate('/documentos/'+id)
    }
  }

  const renderResults = () => {
    if (loading) return <Text type="secondary">Carregando...</Text>;
    if (error) return <Text type="danger">{error}</Text>;
    if (!responseData) return <Text type="secondary">Realize uma pesquisa para exibir resultados</Text>;
    const ativo = ['ATIVO', 'INATIVO', 'OBITO']
  
    return (
      <div className='w-full'>
        <h1 className='text-xl lg:text-2xl font-bold mb-2 lg:mb-4 text-center'>Usuários</h1>
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
          }}
          dataSource={responseData}
          renderItem={(u: User) => (
            <List.Item>
              <Card className="w-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="max-w-[60%]">
                    <p className="font-bold text-base truncate">{u.nome}</p>
                  </div>
                  <div className="flex flex-wrap justify-end">
                    <Button type='text' size="small" icon={<EyeOutlined />} onClick={() => {detalhes(u.id)}} />
                    <Button type='text' size="small" icon={<EditOutlined />} onClick={() => {editarUsuario(u)}} />
                    <Button type='text' size="small" icon={<DiffOutlined />} onClick={() => {adicionarRegistroAtendimento(u.id)}} />
                    <Button type='text' size="small" icon={<FilePdfOutlined />} onClick={() => {anexarDocumentos(u.id)}} />
                  </div>
                </div>
                <p className="text-sm lg:text-base">{ativo[u.ativo]}</p>
                <p className="text-sm lg:text-base">{u.cpf}</p>
                <p className="text-sm lg:text-base">{u.telefone}</p>
                <p className="text-sm lg:text-base">{escolaridades[u.escolaridade]}</p>
                <p className="text-sm lg:text-base">{u.cep}</p>
                <p className="text-sm lg:text-base">...</p>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  };


  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar - now top section on mobile */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-4 lg:p-8 lg:shadow-lg lg:fixed lg:h-full">
        <div className="flex flex-row justify-between">
          <Button icon={<LeftOutlined />} onClick={backHome} className='self-start' />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center">Pesquisa de Usuário</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Pesquisar</label>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tipoPesquisa}
              className="w-full"
            />
            {alertVisible && (
              <Alert 
                message="No mínimo 3 caracteres! " 
                type="error" 
                closable 
                afterClose={() => {setAlertVisible(false)}}
              />
            )}
          </div>
  
          <div>
            <label className="block text-sm mb-2">Tipo de Pesquisa</label>
            <Select
              value={tipoPesquisa}
              onChange={(value) => setTipoPesquisa(value)}
              className="w-full"
            >
              <Select.Option value="nome">Nome</Select.Option>
              <Select.Option value="telefone">Telefone</Select.Option>
              <Select.Option value="cpf">CPF</Select.Option>
              <Select.Option value="cep">CEP</Select.Option>
            </Select>
          </div>
  
          <Button
            onClick={handleSearch}
            className="w-full"
            type="primary"
            loading={loading}
          >
            Pesquisar
          </Button>
        </div>
      </div>
  
      {/* Right Content - now bottom section on mobile */}
      <div className="w-full lg:w-2/3 lg:ml-[33%] bg-white p-4 lg:p-8 min-h-screen">
        <div className="w-full">{renderResults()}</div>
      </div>
    </div>
  );
};

export default PesquisaUsuario;
