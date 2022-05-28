import React from 'react'
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

const UserCheck = ({ children }) => {
    const cookies = new Cookies();
    let user = cookies.get('user');

    if (user) {
        return children;
    }
    return <Navigate to='/login' replace />
}

export default UserCheck