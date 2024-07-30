import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";

interface AutocompleteCommandProps {
  options: GenericFormSelectType[];
  onSelect: (value: GenericFormSelectType) => void;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type GenericFormSelectType = {
  id: string;
  name?: string;
  screenName?: string;
  team?: string;
};

export const AutocompleteCommand: React.FC<AutocompleteCommandProps> = ({
  options = [],
  onSelect,
  placeholder,
  value = "",
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    const selectedOption = options.find(
      (option) => option.name === currentValue,
    );
    if (selectedOption) {
      onSelect(selectedOption);
      onChange({
        target: { value: currentValue, name: "playerName" },
      } as React.ChangeEvent<HTMLInputElement>);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => handleSelect(option.name ?? "")}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
