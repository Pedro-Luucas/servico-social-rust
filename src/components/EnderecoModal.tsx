import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import MaskedInput from 'antd-mask-input';

const { TextArea } = Input;

interface EnderecoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (endereco: {
    cep: string;
    municipio: string;
    bairro: string;
    rua: string;
    numero: string;
    referencia: string | null;
  }) => void;

  initialData?: {
    cep: string;
    municipio: string;
    bairro: string;
    rua: string;
    numero: string;
    referencia: string | null;
  };
}

const EnderecoModal: React.FC<EnderecoModalProps> = ({
  open,
  onClose,
  onSave,
  initialData
}) => {
  const [form] = Form.useForm();

  const fetchAddress = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/[^0-9]/g, "");
    
    if (cleanCep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (response.data && !response.data.erro) {
          const { logradouro, bairro, localidade } = response.data;
          form.setFieldsValue({
            rua: logradouro,
            bairro: bairro,
            municipio: localidade
          });
        } else {
          message.error('CEP não encontrado');
          form.setFieldsValue({
            rua: '',
            bairro: '',
            municipio: ''
          });
        }
      } catch (error) {
        message.error('Erro ao buscar o CEP');
        form.setFieldsValue({
          rua: '',
          bairro: '',
          municipio: ''
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...values,
        cep: values.cep.replace(/[^0-9]/g, "")
      });
      form.resetFields();
      onClose();

    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Adicionar Endereço"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
        autoComplete="off"
      >
          <Form.Item
          name="cep"
          label="CEP"
          rules={[
            { required: true, message: 'Por favor, insira o CEP' }
          ]}
        >
          <MaskedInput 
            mask="00000-000"
            onChange={(e) => fetchAddress(e.target.value)}
            placeholder="CEP"
          />
        </Form.Item>

        <Form.Item
          name="municipio"
          label="Município"
          rules={[{ required: true, message: 'Por favor, insira o município' }]}
        >
          <Input placeholder="Município" />
        </Form.Item>

        <Form.Item
          name="bairro"
          label="Bairro"
          rules={[{ required: true, message: 'Por favor, insira o bairro' }]}
        >
          <Input placeholder="Bairro" />
        </Form.Item>

        <Form.Item
          name="rua"
          label="Rua"
          rules={[{ required: true, message: 'Por favor, insira a rua' }]}
        >
          <Input placeholder="Rua" />
        </Form.Item>

        <Form.Item
          name="numero"
          label="Número"
          rules={[{ required: true, message: 'Por favor, insira o número' }]}
        >
          <Input
            type="number"
            placeholder="Número"
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="referencia"
          label="Referência"
        >
          <TextArea
            placeholder="Ponto de referência"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EnderecoModal;