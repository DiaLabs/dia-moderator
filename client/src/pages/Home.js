import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for the homepage
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 80vh;
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.m}`};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, #2a1259 100%);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.m};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.m} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    background-color: ${({ theme }) => '#7823d8'};
    color: white;
    transform: translateY(-3px);
  }
`;

const SecondaryButton = styled(Link)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `${theme.spacing.m} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    background-color: rgba(138, 43, 226, 0.1);
    transform: translateY(-3px);
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.m}`};
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.m};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const BotSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.m}`};
  background-color: rgba(138, 43, 226, 0.05);
`;

const BotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const CreatorSection = styled.section`
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.m}`};
`;

const CreatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

// User avatar component
const UserAvatar = ({ initial, color }) => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill={color} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="40"
        fontWeight="bold"
        fill="#ffffff"
      >
        {initial}
      </text>
    </svg>
  );
};

const CreatorAvatar = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${({ theme }) => theme.spacing.m};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const CreatorCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
  overflow: hidden;
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CreatorName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const CreatorRole = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Home = () => {
  // Features data
  const features = [
    {
      icon: '🛡️',
      title: 'Advanced Moderation',
      description: 'Automatically filter profanity, detect spam, and moderate content across all your platforms.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Leveraging Google Gemini AI for natural conversation and content summarization capabilities.'
    },
    {
      icon: '⚡',
      title: 'Simple Setup',
      description: 'Easy to configure and deploy. Get started with just a few clicks from our interface.'
    }
  ];
  
  // Bot platforms data
  const botPlatforms = [
    {
      name: 'Discord Bot',
      description: 'Moderate your Discord server with automatic content filtering, warning systems, and customizable commands.',
      icon: '👾'
    },
    {
      name: 'WhatsApp Bot',
      description: 'Keep your WhatsApp groups clean with message moderation, spam detection, and AI-powered chat capabilities.',
      icon: '📱'
    },
    {
      name: 'Telegram Bot',
      description: 'Enhance your Telegram channels with automated moderation, summarization, and conversation assistance.',
      icon: '✈️'
    }
  ];
  
  // Creators data
  const creators = [
    {
      name: 'Dhruv Sen',
      role: '12318540',
      bio: 'A tech enthusiast with a keen interest in AI and machine learning.',
      initial: 'D',
      color: '#9932CC'
    },
    {
      name: 'Itesh Singh Tomar',
      role: '12320263',
      bio: 'Trying my best :)',
      initial: 'I',
      color: '#8A2BE2'
    },
    {
      name: 'Aditya Kumar Anupam',
      role: '12320585',
      bio: 'Passionate about AI and its applications in real-world scenarios.',
      initial: 'A',
      color: '#6A5ACD'
    }
    
  ];
  
  return (
    <>
      <HeroSection>
        <HeroTitle>
          Moderate Your Chats with <span>Dia</span>
        </HeroTitle>
        <HeroSubtitle>
          Powerful AI-driven moderation bots for Discord, WhatsApp, and Telegram.
          Keep your communities safe, clean, and friendly with minimal effort.
        </HeroSubtitle>
        <ButtonGroup>
          <PrimaryButton to="/explore">
            Explore Bots
          </PrimaryButton>
          <SecondaryButton to="/about">
            Learn More
          </SecondaryButton>
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>Our <span>Features</span></SectionTitle>
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeaturesSection>
      
      <BotSection>
        <SectionTitle>Our <span>Bots</span></SectionTitle>
        <BotGrid>
          {botPlatforms.map((platform, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{platform.icon}</FeatureIcon>
              <FeatureTitle>{platform.name}</FeatureTitle>
              <p>{platform.description}</p>
            </FeatureCard>
          ))}
        </BotGrid>
      </BotSection>
      
      <CreatorSection>
        <SectionTitle>Meet the <span>Team</span></SectionTitle>
        <CreatorGrid>
          {creators.map((creator, index) => (
            <CreatorCard key={index}>
              <CreatorAvatar>
                <UserAvatar initial={creator.initial} color={creator.color} />
              </CreatorAvatar>
              <CreatorName>{creator.name}</CreatorName>
              <CreatorRole>{creator.role}</CreatorRole>
              <p>{creator.bio}</p>
            </CreatorCard>
          ))}
        </CreatorGrid>
      </CreatorSection>
    </>
  );
};

export default Home;