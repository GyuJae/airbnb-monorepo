import React from 'react';
import SettingButton from './SettingButton';

const styles = {
  header: 'flex w-full justify-between items-center px-14 py-4 border-b-2',
};

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className="hidden sm:block">Airbnb</h1>
      <form className="sm:w-96 w-full">
        <input className="bg-red-400 h-10 rounded-3xl w-full" />
      </form>
      <SettingButton />
    </header>
  );
};

export default Header;
