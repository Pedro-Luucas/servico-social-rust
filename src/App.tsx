import React, { useEffect } from 'react';
import { User } from './types';
import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/cadastro-usuario',
    element: <CadastroUsuario onSubmit={() => {}} />
  },

]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;