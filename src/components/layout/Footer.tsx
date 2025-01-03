import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../styles/theme';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: theme.colors.ui.backgroundAlt }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img
              src="/images/AxeVault_logo2.png"
              alt="Axe Vault"
              className="h-16"
            />
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/faq" 
              style={{ 
                color: theme.colors.text.secondary,
                ':hover': { color: theme.colors.primary.gold }
              }}
              className="transition-colors"
            >
              FAQ
            </Link>
            <Link 
              to="/privacy" 
              style={{ 
                color: theme.colors.text.secondary,
                ':hover': { color: theme.colors.primary.gold }
              }}
              className="transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              style={{ 
                color: theme.colors.text.secondary,
                ':hover': { color: theme.colors.primary.gold }
              }}
              className="transition-colors"
            >
              Terms of Service
            </Link>
            <a 
              href="mailto:support@axevault.com"
              style={{ 
                color: theme.colors.text.secondary,
                ':hover': { color: theme.colors.primary.gold }
              }}
              className="transition-colors"
            >
              Contact Support
            </a>
          </nav>
        </div>
        
        <div className="mt-8 text-center" style={{ color: theme.colors.text.secondary }}>
          © {new Date().getFullYear()} Axe Vault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}; 