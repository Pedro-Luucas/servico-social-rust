
import { Form, Input, Button, Card, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';

interface LoginValues {
  nome: string;
  senha: string;
}

const LoginOperador = () => {
  const [form] = Form.useForm<LoginValues>();
  const navigate = useNavigate();

  console.log('Rendering LoginOperador component');

  const onFinish = async (values: LoginValues) => {
    console.log('Form submitted with values:', values);
    try {
      console.log('Invoking login_operador with:', { dto: values });
      const operadorId = await invoke<number>('login_operador', { dto: values });
      console.log('Login successful, operadorId:', operadorId);
      
      localStorage.setItem('operadorId', operadorId.toString());
      console.log('OperadorId stored in localStorage:', localStorage.getItem('operadorId'));
      
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      Modal.error({
        title: "Erro!",
        content: "Nome ou senha incorretos.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">LOGIN OPERADOR</h1>
        </div>

        <Form
          form={form}
          name="LoginOperador"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="nome"
            rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
          >
            <Input placeholder="Nome" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="senha"
            rules={[{ required: true, message: 'Por favor, insira a senha!' }]}
          >
            <Input.Password placeholder="Senha" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              ENTRAR
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginOperador;