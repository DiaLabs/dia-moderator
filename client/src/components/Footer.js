import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.m}`};
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.m};
    font-size: 1.2rem;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.s};
  }
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: ${({ theme }) => theme.transition};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.m};
  margin-top: ${({ theme }) => theme.spacing.m};
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 1.5rem;
    transition: ${({ theme }) => theme.transition};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.l};
  margin-top: ${({ theme }) => theme.spacing.l};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Dia-Moderator</h3>
          <p>Advanced moderation bots for your community platforms. Keep your channels friendly and safe with AI-powered moderation.</p>
          <SocialLinks>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <i className="fab fa-discord"></i>
            </a>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLinks>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore Bots</Link></li>
            <li><Link to="/about">About</Link></li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Resources</h3>
          <FooterLinks>
            <li><a href="https://discord.js.org/" target="_blank" rel="noopener noreferrer">Discord.js</a></li>
            <li><a href="https://github.com/pedroslopez/whatsapp-web.js" target="_blank" rel="noopener noreferrer">WhatsApp Web.js</a></li>
            <li><a href="https://github.com/yagop/node-telegram-bot-api" target="_blank" rel="noopener noreferrer">Telegram Bot API</a></li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {currentYear} Dia-Moderator. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;