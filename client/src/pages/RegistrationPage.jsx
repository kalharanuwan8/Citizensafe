import React, { useState } from 'react'
import RegistrationFrom from '../components/auth/RegistrationForm'

const RegistrationPage = () => {
  return (
    <div className="min-h-screen bg-white md:bg-gray-50 md:flex md:items-center md:justify-center">
      <RegistrationFrom/>
    </div>
  );
};

export default RegistrationPage 