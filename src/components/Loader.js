import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div className="spinnerin" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa; /* Added background for consistency */

  .spinner {
    cursor: not-allowed;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: -10px -10px 10px #6359f8, 0px -10px 10px 0px #9c32e2, 10px -10px 10px #f36896, 
                10px 0 10px #ff0b0b, 10px 10px 10px 0px #ff5500, 0 10px 10px 0px #ff9500, 
                -10px 10px 10px 0px #ffb700;
    animation: rot55 0.7s linear infinite;
  }

  .spinnerin {
    border: 2px solid #fff;
    
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes rot55 {
    to {
      transform: rotate(360deg);
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .spinner {
      width: 2.5em;
      height: 2.5em;
    }
    .spinnerin {
      width: 1.25em;
      height: 1.25em;
    }
  }
`;

export default Loader;