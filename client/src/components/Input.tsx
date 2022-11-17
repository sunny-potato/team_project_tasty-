import React, { useState } from 'react';

type SelectProps = {
  optionsList: string[];
  name: string;
  select: any;
  handleSelect: any;
};

export const Select = (props: SelectProps) => {
  const options = props.optionsList.map((option, index) => {
    return (
      <option key={index} value={option}>
        {option}
      </option>
    );
  });

  return (
    <select className={props.name} value={props.select} onChange={props.handleSelect}>
      {options}
    </select>
  );
};

export const useSelect = (initialValue: string) => {
  const [select, setSelect] = useState<string>(initialValue);
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelect(value);
  };
  return [select, handleSelect];
};

type CheckboxProps = {
  label: string;
  isChecked: any;
  handleCheckbox: any;
};
export const Checkbox = (props: CheckboxProps) => {
  return (
    <div>
      <label style={{ display: 'flex', flexDirection: 'row' }}>
        <input type="checkbox" checked={props.isChecked} onChange={props.handleCheckbox} />
        {props.label}
      </label>
    </div>
  );
};

export const useCheckbox = (initialValue: boolean) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialValue);
  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setIsChecked(checked);
  };
  return [isChecked, handleCheckbox];
};
