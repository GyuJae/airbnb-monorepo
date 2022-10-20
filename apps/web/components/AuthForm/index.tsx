import { useRouter } from 'next/router';
import React from 'react';
import Modal from '../Modal';
import CreateAccountForm from './CreateAccountForm';
import LoginForm from './LoginForm';

const AuthForm = () => {
  const router = useRouter();
  const { query, pathname } = router;
  const inView =
    query.auth && (query.auth === 'login' || query.auth === 'create-account');

  const handleClose = () => {
    const params = new URLSearchParams(query as Record<string, string>);
    params.delete('auth');
    router.replace({ pathname, query: params.toString() }, undefined, {
      shallow: true,
    });
  };

  return (
    <Modal inView={inView} handler={handleClose}>
      <div className="p-2 bg-white rounded-md">
        <CreateAccountForm inView={query.auth === 'create-account'} />
        <LoginForm inView={query.auth === 'login'} />
      </div>
    </Modal>
  );
};

export default AuthForm;
