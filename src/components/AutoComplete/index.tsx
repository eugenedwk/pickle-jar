import React, { useState, useRef } from "react";
import { Input } from "../ui/input";

export type GenericFormSelectType = {
  id: string;
  name: string;
  team?: string;
};

type AutocompleteInputProps<T extends GenericFormSelectType> = {
  options: T[];
  onSelect: (value: T) => void;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AutocompleteInput = <T extends GenericFormSelectType>({
  options,
  onSelect,
  placeholder,
  value,
  onChange,
}: AutocompleteInputProps<T>) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (option: T) => {
    onSelect(option);
    setDropdownVisible(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setDropdownVisible(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdownVisible(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(value?.toLowerCase() || ""),
  );

  return (
    <div className="relative text-black" onBlur={handleBlur} tabIndex={-1}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setDropdownVisible(true)}
      />
      {isDropdownVisible && filteredOptions.length > 0 && (
        <ul className="absolute z-10 m-0 w-full list-none border border-gray-300 bg-white p-0">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onMouseDown={() => handleSelect(option)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
