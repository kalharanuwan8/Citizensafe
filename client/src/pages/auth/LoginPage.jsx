import React, { useState } from 'react'
import LoginForm from '../../components/auth/LoginForm'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white md:bg-gray-50 md:flex md:items-center md:justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage