// components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

function BackButton({ text = '', style = {}, ...props }) {
  const navigate = useNavigate();

  return (
    <Button
      icon={<ArrowLeftOutlined />}
      shape='circle'
      onClick={() => navigate(-1)}
      style={{ marginBottom: '16px', ...style }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default BackButton;