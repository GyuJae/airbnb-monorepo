import React from 'react';
import { useForm } from 'react-hook-form';

interface IProps {
  inView: boolean;
}

interface IForm {
  email: string;
}

const LoginForm: React.FC<IProps> = ({ inView }) => {
  const { register } = useForm<IForm>();
  if (!inView) return null;
  return <div>LoginForm</div>;
};

export default LoginForm;
