import React from 'react';

import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';


const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Wrapper = styled('div') ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});


const DivLoader = styled('div') ({
  border: "3px solid #f1f1f1",
  borderTop: "3px solid #3f51b5",
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  animation: `${spin} 1s linear infinite`
});


const Loader = () => {
  return(
    <Wrapper>
      <DivLoader></DivLoader>
    </Wrapper>
  );
}

export default Loader;