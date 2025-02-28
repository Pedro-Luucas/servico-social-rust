import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import ParecerSocial from './pages/ParecerSocial';
import AdicionarDados from './pages/AdicionarDados';
import PesquisaUsuario from './pages/PesquisaUsuario';
import DetalhesUsuario from './pages/DetalhesUsuario';

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
    path: '/parecer-social',
    element: <ParecerSocial />,
  },
  {
    path: '/pesquisa',
    element: <PesquisaUsuario />,
  },
  {
    path: '/detalhes/:id',
    element: <DetalhesUsuario />,
  },

]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;