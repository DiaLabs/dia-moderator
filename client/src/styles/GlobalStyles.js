import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${theme.fonts.main};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 600;
    margin-bottom: ${theme.spacing.m};
    color: ${theme.colors.text};
  }
  
  p {
    margin-bottom: ${theme.spacing.m};
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transition};
    
    &:hover {
      color: ${theme.colors.secondary};
    }
  }
  
  button {
    cursor: pointer;
    font-family: ${theme.fonts.main};
    transition: ${theme.transition};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.m};
  }
  
  section {
    padding: ${theme.spacing.xxl} 0;
  }
`;

export default GlobalStyles;