import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(138, 43, 226, 0.2);
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 1s ease-in-out infinite;
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const Loading = ({ message = 'Loading...' }) => {
  return (
    <LoadingContainer>
      <Spinner />
      <Message>{message}</Message>
    </LoadingContainer>
  );
};

export default Loading;