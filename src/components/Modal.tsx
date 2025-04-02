interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  
  const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">X</button>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;
  