import React, { ReactNode, MouseEvent } from "react";

import "./Modal.css";

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  const handleModalClick = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="modal" onClick={handleModalClick}>
      <div className="modal_content custom-scroll" onClick={handleContentClick}> {/* */}
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
