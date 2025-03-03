import React from 'react';
import { Modal, Form, Input } from 'antd';

const { TextArea } = Input;

interface ParecerSocialModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (parecer: {
    parecer_social: string;
  }) => void;
  initialData?: {
    parecer_social: string;
  };
}

const ParecerSocialModal: React.FC<ParecerSocialModalProps> = ({
  open,
  onClose,
  onSave,
  initialData
}) => {
  const [form] = Form.useForm();

  // Reset form when modal closes
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Parecer Social"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
        autoComplete="off"
      >
        <Form.Item
          name="parecer_social"
          label="Parecer Social"
        >
          <TextArea
            placeholder="Digite o parecer social"
            autoSize={{ minRows: 10, maxRows: 20 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ParecerSocialModal;