import React, { useEffect, useRef } from "react";

import "./Dropdown.css";

interface DropdownProps {
  onClose?: () => void;
  class?: string;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = (props) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && props.onClose) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`dropdown custom-scroll ${props.class ? props.class : ""}`}
    >
      {props.children}  {/*Encapsulating child components in DropDown */}
    </div>
  );
}

export default Dropdown;
