import React from 'react';
import ChatComponent from './ChatComponent';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
      {/* < ChatComponent /> */}
    </div>
  );
};

export default Layout;