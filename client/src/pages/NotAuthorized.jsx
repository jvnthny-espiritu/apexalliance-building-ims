import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { MdArrowBack } from 'react-icons/md';
import { useSelector } from "react-redux";

export default function NotAuthorized() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleGoBack = () => {
        user?.role === 'guest' ? navigate('/'): navigate('/dashboard');
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
            <h2 className="text-2xl font-semibold mb-4">Not Authorized</h2>
            <p className="text-gray-600 mb-8">
                You do not have permission to view this page.
            </p>
            <Button
                variant="contained"
                color="primary"
                startIcon={<MdArrowBack />}
                onClick={handleGoBack}
            >
                Go Back
            </Button>
        </div>
        </div>
    );
};