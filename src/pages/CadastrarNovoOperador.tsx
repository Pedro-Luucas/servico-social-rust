
import { Form, Input, Button, Card, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';

interface NovoOperadorValues {
  nome: string;
  senha: string;
}

const CadastrarNovoOperador = () => {
  const [form] = Form.useForm<NovoOperadorValues>();
  const navigate = useNavigate();
  
  console.log('Rendering CadastrarNovoOperador component');
  
  const onFinish = async (values: NovoOperadorValues) => {
    console.log('Form submitted with values:', values);
    try {
      console.log('Invoking create_operador with:', { dto: values });
      const result = await invoke('create_operador', { dto: values });
      console.log('Operador created successfully, result:', result);
      navigate("/");
      
    } catch (error) {
      console.error('Error creating operador:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">CADASTRAR NOVO OPERADOR</h1>
        </div>

        <Form
          form={form}
          name="CadastrarNovoOperador"
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
              CADASTRAR
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CadastrarNovoOperador;
