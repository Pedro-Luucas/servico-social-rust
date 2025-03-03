import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import AdicionarDados from './pages/AdicionarDados';
import PesquisaUsuario from './pages/PesquisaUsuario';
import DetalhesUsuario from './pages/DetalhesUsuario';
import RegistrosAtendimento from './pages/RegistrosAtendimento';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/cadastro-usuario',
    element: <CadastroUsuario onSubmit={() => {}} />
  },
  {
    path: '/adicionar-dados',
    element: <AdicionarDados />,
  },
  {
    path: '/pesquisa',
    element: <PesquisaUsuario />,
  },
  {
    path: '/detalhes/:id',
    element: <DetalhesUsuario />,
  },
  {
    path: '/registro-atendimento/:id',
    element: <RegistrosAtendimento />,
  },

]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;