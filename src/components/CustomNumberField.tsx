import React from "react";
import { Field } from "formik";
import styled from "styled-components";

interface Props {
  onChange: (name: string, option: "dec" | "inc", step?: string) => void;
  name: string;
  min?: string;
  max?: string;
  step?: string;
}

function CustomNumberField({ name, min, max, onChange, step }: Props) {
  return (
    <NumberFieldWrapper>
      <NumberFieldArrow onClick={() => onChange(name, "dec", step)}>
        <img src="/images/small_dom_down.gif" alt="down-arrow"></img>
      </NumberFieldArrow>
      <NumberField step="0.1" type="number" name={name} min={min} max={max}></NumberField>
      <NumberFieldArrow onClick={() => onChange(name, "inc", step)}>
        <img src="/images/small_dom_up.gif" alt="up-arrow"></img>
      </NumberFieldArrow>
    </NumberFieldWrapper>
  );
}

const NumberFieldWrapper = styled.div`
  display: flex;
  height: 2.25rem;
`;

const NumberField = styled(Field)`
  -moz-appearance: textfield;
  width: 2.5rem;
  text-align: center;
  padding: 0.25rem;
  background: #4a4a4a;
  border: none;
  border-top: 1px solid grey;
  border-bottom: 1px solid grey;
  color: white;

  &:focus {
    background: #6e6d6d;
  }
`;

const NumberFieldArrow = styled.div`
  background: #402e26;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  border: 1px solid grey;

  &:hover {
    cursor: pointer;
    background: #293042;
  }
`;

export default CustomNumberField;
