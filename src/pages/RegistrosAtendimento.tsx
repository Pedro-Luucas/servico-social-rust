import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Card, List, Typography, Result } from 'antd';
import { LeftOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { msgSucesso, msgErro } from '../utils/message';
import { useNavigate, useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const RegistrosAtendimento: React.FC = () => {
  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registroText, setRegistroText] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const { id } = useParams(); // Captura o ID da URL
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegistro, setSelectedRegistro] = useState<string>('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [registroToDelete, setRegistroToDelete] = useState<string | null>(null);

  useEffect(() => {
    const formData = JSON.parse(sessionStorage.getItem('formData') || '{}');
    setUserData(formData);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = await invoke('get_usuario_by_id', { id: id });
        setUserData(user);
        console.log(user)
        const registros = await invoke('get_registros_by_usuario_id', { usuarioId: id });
        console.log(registros)
        setData(registros);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRegistroText('');
  };

  const handleSubmit = async () => {
    try {
      const dto = {
        usuario_id: id,
        registro: registroText,
        operador_id: 0
      }
      const createRegistro = await invoke('create_registro', {
        dto
      });

      console.log(createRegistro)
  
      const registros = await invoke('get_registros_by_usuario_id', { usuarioId: id });
        console.log(registros)
        setData(registros);
      
      msgSucesso('Registro adicionado com sucesso!');
      setIsModalOpen(false);
      setRegistroText('');
    } catch (err) {
      console.error('Error saving registro:', err);
      msgErro('Erro ao salvar registro');
    }
  };

  const handleViewRegistro = (registro: string) => {
    setSelectedRegistro(registro);
    setIsViewModalOpen(true);
  };

  const handleDeleteRegistro = (registroId: string) => {
    setRegistroToDelete(registroId);
  };

  const confirmDelete = async () => {
    if (!registroToDelete) return;
    
    try {
      const result = await invoke('delete_registro', { id: registroToDelete });
      console.log(result)
      
      // Refresh the registros list
      const registros = await invoke('get_registros_by_usuario_id', { usuarioId: id });
      setData(registros);
      
      msgSucesso('Registro excluído com sucesso!');
    } catch (err) {
      console.error('Error deleting registro:', err);
      msgErro('Erro ao excluir registro');
    } finally {
      
      setRegistroToDelete(null);
    }
  };

  const renderResults = () => {
    if (loading) return <Text type="secondary">Carregando...</Text>;
    if (error) return <Text type="danger">{error}</Text>;
    if (!data) return <Text type="secondary">Nenhum registro encontrado</Text>;

    return (
      <div className='w-full'>
        <h1 className='text-xl lg:text-2xl font-bold mb-2 lg:mb-4 text-center'>Registros</h1>
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          dataSource={data}
          renderItem={(item: any) => (
            <List.Item className="w-full">
              <Card
                title={new Date(item.data_atendimento).toLocaleDateString('pt-BR')}
                extra={
                  <div className="flex">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      onClick={() => handleViewRegistro(item.registro)}
                    />
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />} 
                      onClick={() => handleDeleteRegistro(item.id)}
                      danger
                    />
                  </div>
                }
                className="w-full"
              >
                <Paragraph
                  ellipsis={{ rows: 4 }}
                  className="text-sm lg:text-base mb-0"
                >
                  {item.registro}
                </Paragraph>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-4 lg:p-8 lg:shadow-lg lg:fixed lg:h-full">
        <div className="flex flex-row justify-between mx-2 lg:mx-8">
          <h2></h2>
          <Button 
            icon={<LeftOutlined />} 
            onClick={() => navigate(-1)} 
            className='self-start'
          />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-center">
          Registros de Atendimento
        </h1>
        <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center">
          {userData?.nome || ''}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          className="w-full"
        >
          Adicionar Registro
        </Button>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-2/3 lg:ml-[33%] bg-white p-4 lg:p-8 min-h-screen">
        {renderResults()}
      </div>

      {/* Add View Modal */}
      <Modal
        title="Registro de Atendimento"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={'50%'}
      >
        <p className="text-base whitespace-pre-wrap">
          {selectedRegistro}
        </p>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirmar Exclusão"
        open={!!registroToDelete}
        onOk={confirmDelete}
        onCancel={() => setRegistroToDelete(null)}
        okText="Excluir"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <p>Tem certeza que deseja excluir este registro?</p>
      </Modal>

      {/* Modal */}
      <Modal
        title="Adicionar Registro de Atendimento"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText="Salvar"
        cancelText="Cancelar"
        width={'50%'}
      >
        <TextArea
          rows={8}
          placeholder="Digite o registro do atendimento..."
          value={registroText}
          onChange={(e) => setRegistroText(e.target.value)}
          className="mt-4 text-base"
        />
      </Modal>
    </div>
  );
};

export default RegistrosAtendimento;
