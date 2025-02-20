import { message } from 'antd';

export const msgSucesso = (content: string) => {
  message.success(content);
};

export const msgErro = (content: string) => {
  message.error(content);
};

export const msgAviso = (content: string) => {
  message.warning(content);
}; 