import React, { useState, ChangeEvent, FormEvent } from "react";
import { X } from "react-feather";

import "./Editable.css";

interface EditableProps {
  defaultValue?: string;
  text: string;
  placeholder?: string;
  buttonText?: string;
  editClass?: string;
  displayClass?: string;
  onSubmit?: (value: string) => void;
}

const Editable: React.FC<EditableProps> = (props) => {
  const [isEditable, setIsEditable] = useState(false);
  const [inputText, setInputText] = useState(props.defaultValue || "");

  const submission = (e: FormEvent) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      setInputText("");
      props.onSubmit(inputText);
    }
    setIsEditable(false);
  };

  return (
    <div className="editable">
      {isEditable ? (
        <form
          className={`editable_edit ${props.editClass ? props.editClass : ""}`}
          onSubmit={submission}
        >
          <input
            type="text"
            value={inputText}
            placeholder={props.placeholder || props.text}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setInputText(event.target.value)
            }
            autoFocus
          />
          <div className="editable_edit_footer">
            <button type="submit">{props.buttonText || "Add"}</button>
            <X onClick={() => setIsEditable(false)} className="closeIcon" />
          </div>
        </form>
      ) : (
        <p
          className={`editable_display ${
            props.displayClass ? props.displayClass : ""
          }`}
          onClick={() => setIsEditable(true)}
        >
          {props.text} {/*Encapsulating child component text*/}
        </p>
      )}
    </div>
  );
};

export default Editable;
