import { useRouter } from 'next/router';
import React, { MouseEventHandler } from 'react';

interface IProps {
  inView: boolean;
}

const styles = {
  list: 'absolute bg-white shadow-xl py-2 rounded-lg w-60 mt-2 right-0',
  item: 'w-full text-left p-2 hover:bg-gray-100 text-sm',
};

const Menu: React.FC<IProps> = ({ inView }) => {
  const router = useRouter();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    const {
      currentTarget: { value },
    } = event;
    router.push({
      query: {
        auth: value,
      },
    });
  };

  if (!inView) return null;
  return (
    <ul className={styles.list}>
      <li>
        <button
          type="button"
          className={styles.item}
          onClick={handleClick}
          value={'create-account'}
        >
          회원 가입
        </button>
      </li>
      <li>
        <button
          type="button"
          className={styles.item}
          onClick={handleClick}
          value={'login'}
        >
          로그인
        </button>
      </li>
    </ul>
  );
};

export default Menu;
