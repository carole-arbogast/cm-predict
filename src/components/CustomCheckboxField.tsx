import React from "react";
import { Field } from "formik";
import styled from "styled-components";

interface Props {
  name: string;
  isChecked?: boolean;
}

function CustomCheckBoxField({ name, isChecked }: Props) {
  return (
    <StyledCheckboxLabel isChecked={isChecked}>
      <Box isChecked={isChecked}>
        {isChecked && <img src="/images/check.gif" alt="check"></img>}
      </Box>
      <Box isChecked={!isChecked}>
        {!isChecked && <img src="/images/cross.gif" alt="cross"></img>}
      </Box>
      <Checkbox type="checkbox" name={name}></Checkbox>
    </StyledCheckboxLabel>
  );
}

const Box = styled.div<{ isChecked?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid grey;
  width: 2rem;
  height: 2rem;
  background-color: ${(props) => (props.isChecked ? "#293042" : "#402e26")};
`;

const Checkbox = styled(Field)`
  opacity: 0;
  position: fixed;
  width: 0;
`;

const StyledCheckboxLabel = styled.label<{ isChecked?: boolean }>`
  display: flex;
  width: 4rem;

  &:hover {
    cursor: pointer;
  }
`;

export default CustomCheckBoxField;
