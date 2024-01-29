"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {

  const { data: session, status } = useSession();

  return ( 
    <div className={`border-b border-slate-200 px-5 py-3 flex justify-between items-center${session ? ' sticky' : ''} top-0 w-full box-border`}>
      {/* logo */}
      <Link className="flex items-center" href={'/'}>      
        <div className="font-logo text-lg ml">DanielIssues</div>
      </Link>
      {/* search bar */}
      <div></div>
      <div className="flex items-center">
       {session ?
          <nav></nav>
        : 
          <button className="primary-button ml-4" onClick={() => signIn('github')}>Sign In</button>}
      </div>
    </div>
  );
}

export default Navbar;