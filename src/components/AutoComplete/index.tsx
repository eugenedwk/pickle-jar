import React, { useState, useEffect, useRef } from "react";

export interface PlayerInfo {
  id: string;
  name: string;
}
interface AutocompleteInputProps {
  options: PlayerInfo[];
  onSelect: (value: string) => void;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  options,
  onSelect,
  placeholder,
  value,
  onChange,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<PlayerInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  }, [value, options]);

  const handleSelect = (option: PlayerInfo) => {
    onSelect(option.id);
    onChange({
      target: { value: option.name },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2"
      />
      {showSuggestions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto border border-gray-300 bg-white">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
