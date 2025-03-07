import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, List, Typography, Spin } from 'antd';
import { LeftOutlined, PlusOutlined, EyeOutlined, DeleteOutlined, UploadOutlined, FilePdfOutlined, FileWordOutlined, FileImageOutlined, FileExcelOutlined, FileUnknownOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
// Update the import to use readFile instead of readBinaryFile
import { readFile } from '@tauri-apps/plugin-fs';
import { message } from 'antd';
import { writeFile } from '@tauri-apps/plugin-fs';
import { open as openFile } from '@tauri-apps/plugin-shell';

const { Text } = Typography;

const Documentos: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { id } = useParams();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    // Get screen dimensions and resize window to percentages
    invoke('get_screen_size')
      .then((screenSize: any) => {
        const width = screenSize.width * 0.65; 
        const height = screenSize.height * 0.55; 
        
        return invoke('resize_current_window', { width, height });
      })
      .then(() => console.log('Window resized successfully'))
      .catch((error) => console.error('Failed to resize window:', error));

    // Fetch data on component mount
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get user data
      const user = await invoke('get_usuario_by_id', { id });
      setUserData(user);
      
      // Get documents
      const docs = await invoke('get_documentos_by_usuario_id', { usuarioId: id });
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Erro ao carregar os documentos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    console.log('[DEBUG] handleOpenModal called');
    console.log('[DEBUG] Current state before modal open:', {
      isModalOpen: isModalOpen,
      filePath: filePath,
      fileName: fileName,
      fileType: fileType
    });
    setIsModalOpen(true);
    console.log('[DEBUG] Modal should now be open, isModalOpen set to true');
  };

  const handleCancel = () => {
    console.log('[DEBUG] handleCancel called');
    console.log('[DEBUG] Current state before cancel:', {
      isModalOpen: isModalOpen,
      filePath: filePath,
      fileName: fileName,
      fileType: fileType
    });
    setIsModalOpen(false);
    setFilePath(null);
    setFileName(null);
    setFileType(null);
    console.log('[DEBUG] Modal closed and file states reset');
  };
  const selectFile = async () => {
    console.log('[DEBUG] selectFile called');
    try {
      console.log('[DEBUG] Opening file dialog');
      const selected = await open({
        multiple: false,
        directory: false,
        filters: [{
          name: 'Documents',
          extensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'xls', 'xlsx']
        }]
      });
      
      console.log('[DEBUG] File dialog result:', selected);
      
      if (selected && !Array.isArray(selected)) {
        console.log('[DEBUG] Valid file selected:', selected);
        setFilePath(selected);
        
        // Extract file name and type
        const name = selected.split('\\').pop() || selected.split('/').pop() || 'unknown';
        console.log('[DEBUG] Extracted file name:', name);
        setFileName(name);
        
        const extension = name.split('.').pop()?.toLowerCase() || '';
        console.log('[DEBUG] Extracted file extension:', extension);
        let type = 'application/octet-stream';
        
        if (extension === 'pdf') type = 'application/pdf';
        else if (extension === 'doc' || extension === 'docx') type = 'application/msword';
        else if (extension === 'jpg' || extension === 'jpeg') type = 'image/jpeg';
        else if (extension === 'png') type = 'image/png';
        else if (extension === 'xls' || extension === 'xlsx') type = 'application/vnd.ms-excel';
        
        console.log('[DEBUG] Determined file type:', type);
        setFileType(type);
        
        console.log('[DEBUG] Updated state after file selection:', {
          filePath: selected,
          fileName: name,
          fileType: type
        });
      } else {
        console.log('[DEBUG] No file selected or multiple files returned');
      }
    } catch (err) {
      console.error('[DEBUG] Error in selectFile:', err);
      message.error('Erro ao selecionar arquivo');
    }
  };

  const handleSubmit = async () => {
    console.log('[DEBUG] handleSubmit called');
    console.log('[DEBUG] Current state before submission:', {
      filePath: filePath,
      fileName: fileName,
      fileType: fileType,
      id: id
    });
    
    if (!filePath || !fileName || !fileType || !id) {
      console.log('[DEBUG] Missing required data for submission');
      message.error('Por favor, selecione um arquivo para upload');
      return;
    }

    console.log('[DEBUG] Setting uploadLoading to true');
    setUploadLoading(true);
    
    try {
      console.log('[DEBUG] Reading file content from:', filePath);
      // Update to use readFile instead of readBinaryFile
      const fileContent = await readFile(filePath);
      console.log('[DEBUG] File content read successfully, byte length:', fileContent.length);
      
      console.log('[DEBUG] Preparing document upload DTO');
      const uploadDto = {
        usuario_id: id,
        documento: Array.from(fileContent),
        file_name: fileName,
        file_type: fileType,
        operador_id: Number(localStorage.getItem('operadorId'))
      };
      console.log('[DEBUG] Upload DTO prepared:', { 
        ...uploadDto, 
        documento: `[Binary data of length: ${uploadDto.documento.length}]` 
      });
      
      // Upload document
      console.log('[DEBUG] Invoking upload_documento');
      console.log(uploadDto)
      await invoke('upload_documento', { dto: uploadDto });
      console.log('[DEBUG] Document uploaded successfully');
      
      // Refresh documents list
      console.log('[DEBUG] Refreshing documents list');
      await fetchData();
      
      console.log('[DEBUG] Upload completed successfully');
      message.success('Documento anexado com sucesso!');
      setIsModalOpen(false);
      setFilePath(null);
      setFileName(null);
      setFileType(null);
      console.log('[DEBUG] Modal closed and state reset after successful upload');
    } catch (err) {
      console.error('[DEBUG] Error in handleSubmit:', err);
      message.error('Erro ao anexar documento');
    } finally {
      console.log('[DEBUG] Setting uploadLoading to false');
      setUploadLoading(false);
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocumentToDelete(documentId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await invoke('delete_documento', { id: documentToDelete });
      
      // Refresh documents list
      await fetchData();
      
      message.success('Documento excluído com sucesso!');
    } catch (err) {
      console.error('Error deleting document:', err);
      message.error('Erro ao excluir documento');
    } finally {
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleViewDocument = async (document: any) => {
    try {
      console.log('[DEBUG] Fetching document content:', document.id);
      
      // Get the document content from the backend
      const content = await invoke('get_documento_content', { id: document.id });
      
      if (!content) {
        throw new Error('Document content not found');
      }
      
      // Create a temporary file path with the original extension
      const extension = document.file_name.split('.').pop() || '';
      const tempDir = await invoke('get_temp_dir');
      const tempPath = `${tempDir}${document.id}.${extension}`;
      
      console.log('[DEBUG] Saving document to temp file:', tempPath);
      
      // Save the content to a temporary file
      await writeFile(tempPath, new Uint8Array(content as number[]));
      
      // Open the file with the system's default application
      console.log('[DEBUG] Opening document with default viewer');
      await openFile(tempPath);
      
    } catch (err) {
      console.error('[DEBUG] Error viewing document:', err);
      message.error('Erro ao visualizar documento');
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined className="text-6xl text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined className="text-6xl text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined className="text-6xl text-green-500" />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined className="text-6xl text-green-700" />;
      default:
        return <FileUnknownOutlined className="text-6xl text-gray-500" />;
    }
  };

  const backToPesquisa = () => {
    navigate(`/pesquisa`);
  };

  const renderResults = () => {
    if (loading) return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
    if (error) return <Text type="danger">{error}</Text>;
    if (!documents || documents.length === 0) return <Text type="secondary" className="text-center block mt-8">Nenhum documento encontrado</Text>;

    return (
      <div className='w-full'>
        <h1 className='text-xl lg:text-2xl font-bold mb-2 lg:mb-4 text-center'>Documentos</h1>
        <List
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          dataSource={documents}
          renderItem={(item: any) => (
            <List.Item className="w-full">
              <Card
                className="w-full"
                actions={[
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewDocument(item)}
                  />,
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteDocument(item.id)}
                    danger
                  />
                ]}
              >
                <div className="flex flex-col items-center">
                  <Text strong className="mb-4 text-center">
                    {item.file_name}
                  </Text>
                  <div className="my-4">
                    {getFileIcon(item.file_name)}
                  </div>
                  <Text type="secondary" className="text-xs">
                    {new Date(item.data_upload).toLocaleDateString('pt-BR')}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar - now top section on mobile */}
      <div className="w-full lg:w-1/3 bg-gray-100 p-4 lg:p-8 lg:shadow-lg lg:fixed lg:h-full">
        <div className="flex flex-row justify-between">
          <Button icon={<LeftOutlined />} onClick={backToPesquisa} className='self-start' />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center">Documentos do Usuário</h1>
        
        {userData && (
          <div className="mb-6">
            <Text strong className="block mb-1">Nome:</Text>
            <Text className="block mb-3">{userData.nome}</Text>
            
            <Text strong className="block mb-1">CPF:</Text>
            <Text className="block mb-3">{userData.cpf}</Text>
          </div>
        )}
        
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModal}
          className="w-full"
        >
          Anexar Documento
        </Button>
      </div>
  
      {/* Right Content - now bottom section on mobile */}
      <div className="w-full lg:w-2/3 lg:ml-[33%] bg-white p-4 lg:p-8 min-h-screen">
        <div className="w-full">{renderResults()}</div>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Anexar Documento"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
            loading={uploadLoading}
          >
            Anexar
          </Button>,
        ]}
      >
        <div className="my-4">
          <Button 
            icon={<UploadOutlined />} 
            onClick={selectFile}
            className="w-full mb-4"
          >
            Selecionar Arquivo
          </Button>
          
          {filePath && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <Text strong>Arquivo selecionado:</Text>
              <Text className="block mt-1">{fileName}</Text>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirmar Exclusão"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger
            onClick={confirmDelete}
          >
            Excluir
          </Button>,
        ]}
      >
        <p>Tem certeza que deseja excluir este documento?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
};

export default Documentos;