import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <span>&copy; {new Date().getFullYear()} Mohammad Iftequaruddin</span>
      <a href="#top">Back to top &uarr;</a>
    </footer>
  );
};
