import React, { useCallback, useEffect, useState } from 'react';
import { Input, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { msgErro, msgSucesso } from '../utils/message';
import { invoke } from '@tauri-apps/api/core';

const ParecerSocial: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(() => {
    try {
      const formData = JSON.parse(sessionStorage.getItem('formData') || '{}');
      return formData.parecer_social || '';
    } catch (error) {
      console.error('Error loading parecer social:', error);
      return '';
    }
  });

  useEffect(() => {

    invoke('resize_current_window', { width: 800, height: 600 })
      .then(() => console.log('Window resized successfully'))
      .catch((error) => console.error('Failed to resize window:', error));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const formData = JSON.parse(sessionStorage.getItem('formData') || '{}');
      const updatedFormData = {
        ...formData,
        parecer_social: value
      };
      sessionStorage.setItem('formData', JSON.stringify(updatedFormData));
      msgSucesso('Parecer social salvo com sucesso');
      navigate(-1);
    } catch (error) {
      console.error('Error saving parecer social:', error);
      msgErro('Erro ao salvar parecer social');
    }
  }, [value, navigate]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">Serviço Social</h1>
      <h1 className="md:text-2xl font-bold mb-4 md:mb-4 text-center">Parecer Social</h1>
      
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mx-8">
          <Button icon={<LeftOutlined />} onClick={() => navigate(-1)} />
        </div>

        <div className="mt-8">
          <Input.TextArea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Parecer social"
            className="w-full text-lg"
            rows={10}
          />
        </div>
        <div>
          <Button type="primary" className='md:col-span-2 bg-blue-600 text-white p-3 md:p-6 w-full text-lg rounded mt-5'
           onClick={handleSubmit}>Salvar</Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ParecerSocial); 