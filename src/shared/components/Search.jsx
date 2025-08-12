
import React from 'react';
import { Input } from './Input';

const Search = ({ value, onChange, placeholder }) => {
  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder={placeholder || "Buscar..."}
        valor={value}
        onChange={(e) => onChange(e.target.value)}
        icon="🔍"
      />
    </div>
  );
};

export default Search;
