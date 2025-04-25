import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: rgba(244, 67, 54, 0.1);
  border-left: 4px solid ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.m};
  margin: ${({ theme }) => theme.spacing.m} 0;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const RetryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const Error = ({ title = 'Error', message = 'Something went wrong', onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      {onRetry && <RetryButton onClick={onRetry}>Try Again</RetryButton>}
    </ErrorContainer>
  );
};

export default Error;