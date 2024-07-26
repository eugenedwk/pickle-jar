import React, { useState, useRef } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";

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

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdownVisible(false);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(value?.toLowerCase() || ""),
  );

  return (
    <div
      className="relative w-3/4 text-black"
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <Command>
        <CommandInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onValueChange={(newValue) =>
            onChange({
              target: { value: newValue },
            } as React.ChangeEvent<HTMLInputElement>)
          }
          onFocus={() => setDropdownVisible(true)}
        />
        {isDropdownVisible && filteredOptions.length > 0 && (
          <CommandList>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => handleSelect(option)}
              >
                {option.name}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
};
