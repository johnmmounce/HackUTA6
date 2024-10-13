import React from 'react';

interface NavbarProps {
  username: string; // The name of the current signed-in user
  onClick: () => void; // Function to call when logging out
}

const Navbar: React.FC<NavbarProps> = ({ username, onClick }) => {
    return (
      <nav className="navbar">
        <div className="navbar-username">{username}</div>
        <button onClick={onClick}>
          Logout
        </button>
      </nav>
    );
  };
  

// Export the component
export default Navbar;