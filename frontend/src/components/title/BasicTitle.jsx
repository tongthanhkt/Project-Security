import React from "react";
import styled from "styled-components";
const HeadingStyles = styled.h2`
  color: linear-gradient(
    90deg,
    rgba(4, 118, 244, 1) 0%,
    rgba(4, 191, 253, 1) 100%
  );
  font-size: 28px;
  position: relative;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  &:before {
    content: "";
    width: 104px;
    height: 4px;
    background: linear-gradient(
      90deg,
      rgba(4, 118, 244, 1) 0%,
      rgba(4, 191, 253, 1) 100%
    );
    position: absolute;
    top: -8px;
    left: 0;
    margin-bottom: 4px;
    transform: translate(0, -150%);
  }
  .line {
    transform: translateY();
    height: 4px;
    width: 244px;
    margin-left: 48px; /* Adjust this value as needed */
    background: linear-gradient(
      90deg,
      rgba(4, 118, 244, 1) 0%,
      rgba(4, 191, 253, 1) 100%
    );
  }
`;
const BasicTitle = ({ className = "", children }) => {
  return (
    <>
      <HeadingStyles className={className}>
        <p className="font-bold text-[42px] text-[#192335]">{children}</p>
        <span>
          <hr className="line"></hr>
        </span>
      </HeadingStyles>
    </>
  );
};

export default BasicTitle;
