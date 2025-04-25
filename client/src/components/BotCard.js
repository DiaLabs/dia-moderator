import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.div`
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.l};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
  color: ${({ theme }) => theme.colors.text};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  flex-grow: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const Badge = styled.span`
  background-color: ${({ theme, status }) => 
    status === 'running' ? 'rgba(76, 175, 80, 0.2)' : 
    status === 'stopped' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(138, 43, 226, 0.2)'};
  color: ${({ theme, status }) => 
    status === 'running' ? theme.colors.success : 
    status === 'stopped' ? theme.colors.error : theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const Button = styled.button`
  background-color: ${({ theme, isRunning }) => 
    isRunning ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    background-color: ${({ theme, isRunning }) => 
      isRunning ? '#d32f2f' : '#7823d8'};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const BotCard = ({ 
  name, 
  description, 
  image, 
  status = 'stopped', 
  isRunning = false,
  isLoading = false,
  onStart,
  onStop
}) => {
  const handleAction = () => {
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
  };
  
  return (
    <Card>
      <CardImage>
        <img src={image} alt={name} />
      </CardImage>
      <CardContent>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardFooter>
          <Badge status={status}>
            {status === 'running' ? 'Running' : 
             status === 'stopped' ? 'Stopped' : 'Ready'}
          </Badge>
          <Button 
            isRunning={isRunning} 
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isRunning ? 'Stop Bot' : 'Start Bot'}
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default BotCard;