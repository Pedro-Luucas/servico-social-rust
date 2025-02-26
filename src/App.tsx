import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import ParecerSocial from './pages/ParecerSocial';
import AdicionarDados from './pages/AdicionarDados';

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

]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;