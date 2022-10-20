import React from 'react';
import AuthForm from '../AuthForm';
import Header from './Header';

interface IProps {
  children: React.ReactNode;
}

const styles = {
  main: 'px-14 py-2',
};

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className={styles.main}>{children}</main>
      <AuthForm />
    </>
  );
};

export default Layout;
