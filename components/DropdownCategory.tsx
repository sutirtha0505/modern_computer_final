"use client";
import { Badge, BadgeCheck, ChevronDown, X, Check, MinusCircle } from "lucide-react";
import { useState, useEffect } from "react";

type DropdownOption = {
  id: string;
  product_main_category: string;
  category_product_image: string;
};

type DropdownProps = {
  options: DropdownOption[];
  onSelect: (options: DropdownOption[]) => void;
  multiple?: boolean;
  reset?: boolean;
};

const DropdownCategory: React.FC<DropdownProps> = ({ options, onSelect, multiple = true, reset }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    if (reset) {
      setSelectedOptions([]);
    }
  }, [reset]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: DropdownOption) => {
    let newSelectedOptions;
    if (multiple) {
      const isSelected = selectedOptions.find(
        (selected) => selected.id === option.id
      );
      if (isSelected) {
        newSelectedOptions = selectedOptions.filter(
          (selected) => selected.id !== option.id
        );
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
    } else {
      newSelectedOptions = [option];
      setIsOpen(false); // Close dropdown after selecting an option in single mode
    }
    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions);
  };

  const truncateName = (name: string) => {
    const words = name.split(' ');
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    }
    return name;
  };

  const handleDeselectOption = (option: DropdownOption) => {
    const updatedOptions = selectedOptions.filter(
      (selected) => selected.id !== option.id
    );
    setSelectedOptions(updatedOptions);
    onSelect(updatedOptions);
  };

  const handleSelectAll = () => {
    setSelectedOptions(options);
    onSelect(options);
  };

  const handleDeselectAll = () => {
    setSelectedOptions([]);
    onSelect([]);
  };

  const filteredOptions = options.filter(
    (option) => !selectedOptions.find((selected) => selected.id === option.id)
  );

  return (
    <div className="w-[40%] bg-transparent border-2 flex justify-center rounded-md flex-col">
      <div className="p-2" onClick={toggleDropdown}>
        {selectedOptions.length > 0 ? (
          <div>
            {selectedOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between cursor-pointer">
                <div className="flex flex-wrap justify-center items-center">
                  <img
                    src={option.category_product_image}
                    alt={option.product_main_category}
                    className="w-8 h-8 mr-2"
                  />{" "}
                  <p>{truncateName(option.product_main_category)}</p>
                </div>
                {multiple && (
                  <X
                    className="cursor-pointer text-gray-500"
                    onClick={() => handleDeselectOption(option)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Select categories</p>
        )}
        <ChevronDown className="ml-2 cursor-pointer" />
      </div>
      {isOpen && (
        <div className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-full mt-1 z-10">
          <div className="p-2 border-b">
            <button
              className="w-full text-left hover:bg-gray-100 p-2 rounded-md"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              className="w-full text-left hover:bg-gray-100 p-2 rounded-md"
              onClick={handleDeselectAll}
            >
              Deselect All
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                <div className="flex items-center">
                  <img
                    src={option.category_product_image}
                    alt={option.product_main_category}
                    className="w-8 h-8 mr-2"
                  />
                  <p>{truncateName(option.product_main_category)}</p>
                </div>
                {selectedOptions.find((selected) => selected.id === option.id) && (
                  <Check className="text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownCategory;
