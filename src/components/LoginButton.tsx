'use client';

import { signIn } from 'next-auth/react'
import React from 'react'

const LoginButton = () => {
  return (
    <button className="black-button text-lg px-6 py-1 mt-4" onClick={() => signIn('github')}>Log in</button>
  )
}

export default LoginButton