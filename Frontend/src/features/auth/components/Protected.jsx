import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import Loading from '../../../components/ui/Loading';

const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    if (loading) {
        return <Loading fullScreen message="Authenticating session..." />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default Protected;