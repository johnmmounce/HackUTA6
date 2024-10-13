import React from 'react';

interface NavbarProps {
  username: string; // The name of the current signed-in user
  onClick: () => void; // Function to call when logging out
}

const Navbar: React.FC<NavbarProps> = ({ username, onClick }) => {
    return (
      <nav className="navbar">
        <div className="navbar-username">{username}</div>
        <img src="logo.png" alt="Logo" style={{ display: 'block', margin: '0 auto', width: '20%', height: '10%' }} />
        <button onClick={onClick}>
          Logout
        </button>
      </nav>
    );
  };
  

// Export the component
export default Navbar;