import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { listen } from '@tauri-apps/api/event';

import CadastroUsuario from './pages/CadastroUsuario';
import Home from './pages/Home';
import AdicionarDados from './pages/AdicionarDados';
import PesquisaUsuario from './pages/PesquisaUsuario';
import DetalhesUsuario from './pages/DetalhesUsuario';
import RegistrosAtendimento from './pages/RegistrosAtendimento';
import CadastrarNovoOperador from './pages/CadastrarNovoOperador';
import LoginOperador from './pages/LoginOperador';

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
  {
    path: '/cadastrarnovooperador',
    element: <CadastrarNovoOperador />,
  },
  {
    path: '/login',
    element: <LoginOperador />,
  },
]);

const App: React.FC = () => {
  useEffect(() => {
    // Listen for window close event
    const unlisten = listen('tauri://close-requested', () => {
      console.log('Window close requested, clearing operadorId');
      localStorage.setItem('operadorId', '0');
    });

    // Clean up the listener when component unmounts
    return () => {
      unlisten.then(unlistenFn => unlistenFn());
    };
  }, []);

  return <RouterProvider router={router} />;
};

export default App;