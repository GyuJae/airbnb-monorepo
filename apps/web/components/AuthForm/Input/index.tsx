import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface IProps {
  register: UseFormRegisterReturn;
}

const Input: React.FC<IProps> = ({ register }) => {
  return <input {...register} />;
};

export default Input;
