import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
const Home: React.FC = () => {
  const navigate = useNavigate();

  // Clear session storage on component mount
  useEffect(() => {
    sessionStorage.removeItem('formData');
    sessionStorage.setItem('edit', 'false');
  }, []);

  const handleCadastroClick = () => {
    navigate('/cadastro-usuario');
  };

  const handlePesquisarClick = () => {
    navigate('/pesquisa');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
        Bem vindo ao Sistema de Serviço Social
      </h1>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md text-center">
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
    </div>
  );
};

export default Home;