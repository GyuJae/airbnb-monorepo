import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useClickAway } from 'react-use';

interface IProps {
  inView: boolean;
  handler?: () => void;
}

const Modal: React.FC<PropsWithChildren<IProps>> = ({
  children,
  inView,
  handler,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickAway(containerRef, handler!);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (!inView || !mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed left-0 top-0 z-50 flex min-h-screen w-screen items-center justify-center bg-black/60">
      <div ref={containerRef}>{children}</div>
    </div>,
    document.getElementById('modal-root')!,
  );
};

export default Modal;
