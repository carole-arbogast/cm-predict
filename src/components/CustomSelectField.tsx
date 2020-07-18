import React from "react";
import styled from "styled-components";

interface Props {
  onFieldChange: (value: string) => void;
  value: string;
  options: string[];
}

function CustomSelectField({ value, options, onFieldChange }: Props) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const container = React.useRef(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (container.current && container.current === e.target) {
      setDropdownOpen(false);
    }
  };

  const handleChange = (value: string) => {
    onFieldChange(value);
    setDropdownOpen(false);
  };
  return (
    <>
      {dropdownOpen && (
        <OutsideDiv ref={container} onClick={handleOutsideClick as any}></OutsideDiv>
      )}
      <CustomSelectWrapper>
        <Header onClick={() => setDropdownOpen(!dropdownOpen)}>
          {(options.includes(value) && value) || "Sélectionner un bâtiment"}
          <img src="/images/small_dom_down.gif" alt="arrow-down"></img>
        </Header>

        {dropdownOpen && (
          <SelectContainer>
            <Select>
              {options.map((option) => (
                <Option
                  key={option}
                  onClick={() => handleChange(option)}
                  isSelected={value === option}
                >
                  {option}
                </Option>
              ))}
            </Select>
          </SelectContainer>
        )}
      </CustomSelectWrapper>
    </>
  );
}

const OutsideDiv = styled.div`
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
`;

const CustomSelectWrapper = styled.div`
  /* position: absolute; */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #293042;
  color: white;
  width: 18rem;
  cursor: pointer;
  border: 1px solid grey;
  z-index: 2;
`;

const SelectContainer = styled.div`
  position: absolute;
  border: 1px solid grey;
  max-height: 20em;
  overflow: auto;
`;

const Select = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: #402e26;
`;

const Option = styled.div<{ isSelected?: boolean }>`
  padding: 0.5rem;
  width: 18rem;
  background: ${(props) => (props.isSelected ? "#293042" : "inherit")};

  &:hover {
    background: #293042;
  }
`;

export default CustomSelectField;
