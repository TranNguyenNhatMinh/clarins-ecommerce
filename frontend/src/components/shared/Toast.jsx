import { useEffect, useRef } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const t = setTimeout(() => onCloseRef.current?.(), 4000);
    return () => clearTimeout(t);
  }, []);

  const bg = type === 'error' ? 'bg-red-500' : 'bg-green-600';
  return (
    <div className={`fixed bottom-4 right-4 ${bg} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">×</button>
    </div>
  );
}
