import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

type SelectProps<T> = {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  renderOption: (option: T) => React.ReactNode;
  getOptionValue: (option: T) => string;
  labelValue: string;
};

function Select<T>({
  options,
  value,
  onChange,
  renderOption,
  getOptionValue,
  labelValue,
}: SelectProps<T>) {
  return (
    <Field className="relative">
      <Label>{labelValue}</Label>
      <Listbox value={value} onChange={onChange}>
        <ListboxButton
          className={clsx(
            "relative block w-full rounded-lg bg-white py-1.5 pr-8 pl-3 text-left text-md text-slate-800",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-gray-800 min-h-10 border border-gray-300"
          )}
        >
          {renderOption(value)}
          <ChevronDownIcon
            className="group pointer-events-none absolute top-3 right-2.5 size-4 fill-slate-800"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-[var(--button-width)] rounded-xl border border-gray-300 bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
          )}
        >
          {options.map((option) => (
            <ListboxOption
              key={getOptionValue(option)}
              value={option}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-100"
            >
              {({ selected, selectedOption }) => (
                <div
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-4 ${
                    selectedOption ? "bg-blue-500 text-white" : "text-gray-900"
                  } ${selected ? "font-bold" : ""}`}
                >
                  {renderOption(option)}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}

export default Select;
