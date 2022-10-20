import React from 'react';

interface IProps {
  inView: boolean;
}

const CreateAccountForm: React.FC<IProps> = ({ inView }) => {
  if (!inView) return null;
  return <div>CreateAccountForm</div>;
};

export default CreateAccountForm;
