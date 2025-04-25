import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.m}`};
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageDescription = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.l};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TeamSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TeamMemberCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const MemberImage = styled.div`
  height: 250px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  svg {
    width: 60%;
    height: 60%;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  ${TeamMemberCard}:hover & img {
    transform: scale(1.05);
  }
`;

const MemberInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.l};
`;

const MemberName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

const MemberRole = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.m};
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

const About = () => {
  // Team members data
  const teamMembers = [
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
    <PageContainer>
      <PageTitle>About <span>Dia Moderator</span></PageTitle>
      <PageDescription>
        Learn about our project, our vision, and the team behind Dia Moderator
      </PageDescription>
      
      <Section>
        <SectionTitle>Our <span>Vision</span></SectionTitle>
        <p>
          Dia Moderator began with a simple vision: to create a unified moderation solution for chat platforms 
          that would make community management easier, safer, and more efficient. We wanted to leverage the 
          power of AI to automate the tedious aspects of content moderation while giving community managers 
          powerful tools to maintain healthy conversations.
        </p>
        <p>
          Our goal is to democratize access to advanced moderation tools, making them available not just to 
          large organizations with dedicated teams, but to anyone running a community of any size. We believe 
          that with the right tools, online communities can flourish as spaces for meaningful connection and 
          conversation.
        </p>
      </Section>
      
      <Section>
        <SectionTitle>Meet Our <span>Team</span></SectionTitle>
        <TeamSection>
          <TeamGrid>
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index}>
                <MemberImage>
                  <UserAvatar initial={member.initial} color={member.color} />
                </MemberImage>
                <MemberInfo>
                  <MemberName>{member.name}</MemberName>
                  <MemberRole>{member.role}</MemberRole>
                  <p>{member.bio}</p>
                </MemberInfo>
              </TeamMemberCard>
            ))}
          </TeamGrid>
        </TeamSection>
      </Section>
      
      <Section>
        <SectionTitle>Future <span>Roadmap</span></SectionTitle>
        <p>
          We're continuously working to improve Dia Moderator and expand its capabilities. Our roadmap includes:
        </p>
        <ul>
          <li>More advanced AI capabilities, including toxic content detection and summarization</li>
          <li>Support for additional platforms like Slack and Microsoft Teams</li>
          <li>Custom rules and moderation policies</li>
          <li>Analytics dashboard for community insights</li>
          <li>Multi-language support for global communities</li>
        </ul>
        <p>
          We're excited about the future of Dia Moderator and are committed to building tools that help create safer, 
          more engaging online communities.
        </p>
      </Section>
    </PageContainer>
  );
};

export default About;