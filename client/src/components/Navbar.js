import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.m} ${theme.spacing.l}`};
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s};
  
  img {
    height: 40px;
  }
  
  h1 {
    font-size: 1.5rem;
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    
    span {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.l};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.surface};
    padding: ${({ theme }) => theme.spacing.m};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.text)};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transition};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(138, 43, 226, 0.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <NavbarContainer>
      <Logo to="/">
        <h1>
          <span>Dia</span>-Moderator
        </h1>
      </Logo>
      
      <MobileMenuButton onClick={toggleMenu}>
        {isOpen ? '✕' : '☰'}
      </MobileMenuButton>
      
      <NavLinks isOpen={isOpen}>
        <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>
          Home
        </NavLink>
        <NavLink to="/explore" active={location.pathname === '/explore' ? 1 : 0}>
          Explore Bots
        </NavLink>
        <NavLink to="/about" active={location.pathname === '/about' ? 1 : 0}>
          About
        </NavLink>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;