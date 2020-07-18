import React from "react";
import styled from "styled-components";
import { Field } from "formik";

interface Props {
  isChecked?: boolean;
  value: string;
  name: string;
  label?: string;
  img?: string;
}

export function CustomRadioField({ isChecked, value, label, name, img }: Props) {
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <StyledRadioLabel
      isChecked={isChecked}
      onFocus={handleFocus}
      onBlur={handleBlur}
      isFieldFocused={isFocused}
    >
      {img && <HordesIcon src={img} alt="name"></HordesIcon>} {label || value}
      <Field as={StyledRadioButton} type="radio" name={name} value={value}></Field>
    </StyledRadioLabel>
  );
}

const StyledRadioButton = styled.input`
  opacity: 0;
  position: fixed;
  width: 0;

  &:hover {
    cursor: pointer;
  }
`;

const StyledRadioLabel = styled.label<{ isChecked?: boolean; isFieldFocused?: boolean }>`
  display: inline-block;
  background-color: ${(props) => (props.isChecked ? "#293042" : "#402e26")};

  padding: 0.5rem;
  border: ${(props) => (props.isFieldFocused ? "1px solid black" : "1px solid grey")};
  border-radius: 4px;
  margin: 0.5rem;

  &:hover {
    cursor: pointer;
    background: #293042;
  }
`;

const HordesIcon = styled.img`
  margin-right: 0.25rem;
`;

export default CustomRadioField;
