import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { invoke } from '@tauri-apps/api/core';
import { SettingOutlined } from '@ant-design/icons';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // Clear session storage on component mount
  useEffect(() => {
    sessionStorage.removeItem('formData');
    sessionStorage.setItem('edit', 'false');

    // Check if user is logged in
    const operadorId = localStorage.getItem('operadorId');
    const operadorIdNum = operadorId ? parseInt(operadorId) : 0;
    
    if (!operadorIdNum || operadorIdNum <= 0) {
      console.log('No valid operador ID found, redirecting to login');
      navigate('/login');
      return;
    }

    invoke('resize_current_window', { width: 800, height: 375 })
      .then(() => console.log('Window resized successfully'))
      .catch((error) => console.error('Failed to resize window:', error));
  }, []);

  const handleCadastroClick = () => {
    navigate('/cadastro-usuario');
  };

  const handlePesquisarClick = () => {
    navigate('/pesquisa');
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCadastrarOperador = () => {
    setIsModalOpen(false);
    navigate('/cadastrarnovooperador');
  };

  const handleLoginOperador = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 ">
      <div className="flex justify-end mb-4">
        <Button 
          icon={<SettingOutlined />} 
          onClick={showModal}
          className="text-xl"
          type="text"
        />
      </div>
      
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
        Bem vindo ao Sistema de Serviço Social
      </h1>
      <div className="max-w-xl mx-auto bg-white p-6 text-center">
        <p className="text-lg mb-6">Escolha uma opção abaixo:</p>

        <div className="grid grid-cols-1 gap-4">
          <Button
            onClick={handleCadastroClick}
            className="bg-blue-500 text-white p-4 rounded-lg text-lg w-full hover:bg-blue-600"
          >
            Cadastrar Usuário
          </Button>

          <Button
            onClick={handlePesquisarClick}
            className="bg-green-500 text-white p-4 rounded-lg text-lg w-full hover:bg-green-600"
          >
            Pesquisar Usuário
          </Button>
        </div>
      </div>

      <Modal 
        title="Configurações de Operador" 
        open={isModalOpen} 
        onCancel={handleCancel}
        footer={null}
      >
        <div className="grid grid-cols-1 gap-4 mt-4">
          <Button
            onClick={handleCadastrarOperador}
            className="bg-blue-500 text-white p-4 rounded-lg text-lg w-full hover:bg-blue-600"
          >
            Cadastrar Novo Operador
          </Button>
          
          <Button
            onClick={handleLoginOperador}
            className="bg-green-500 text-white p-4 rounded-lg text-lg w-full hover:bg-green-600"
          >
            Login Operador
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Home;