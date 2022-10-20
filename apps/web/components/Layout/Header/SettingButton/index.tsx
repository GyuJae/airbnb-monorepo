import React, { useRef, useState } from 'react';
import Menu from './Menu';
import Toggle from './Toggle';
import { useClickAway } from 'react-use';

const styles = {
  wrapper: 'relative',
  button:
    'hidden sm:flex items-center justify-center space-x-1 shadow-none hover:shadow-2xl  py-1 px-2 rounded-full border-[1.5px] transition-shadow duration-500',
};

const SettingButton = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  const handleToggleMenu = () => setIsOpenMenu((prev) => !prev);
  const handleCloseMenu = () => setIsOpenMenu(false);

  useClickAway(wrapperRef, handleCloseMenu);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Toggle handleToggleMenu={handleToggleMenu} />
      <Menu inView={isOpenMenu} />
    </div>
  );
};

export default SettingButton;
