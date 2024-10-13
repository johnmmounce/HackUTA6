import React from 'react';
import PropTypes from 'prop-types';

const ProfileBox = ({ user }) => {
    return (
        <div>
            <h3>User Profile</h3>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

ProfileBox.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
};

export default ProfileBox;
