import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1>
        <span className="title-text">GitSearch</span>
        <span className="title-icon">🔎</span>
      </h1>
      <p>Digite um username do GitHub para ver o perfil</p>
    </header>
  );
};

export default Header;