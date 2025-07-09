import React from 'react';
import './InputBar.css';

interface InputBarProps {
  placeholder: string;
  name?: string; // ✅ Add name
  value?: string; // ✅ Add value
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBar: React.FC<InputBarProps> = ({ placeholder, name, value, onChange }) => {
  return (
    <div className="input-container">
      <input
        type="text"
        id="large-input"
        className="large-input"
        placeholder={placeholder}
        name={name}      // ✅ Allow name
        value={value}    // ✅ Allow value
        onChange={onChange}
      />
    </div>
  );
};

export default InputBar;
