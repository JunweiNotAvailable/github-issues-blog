"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {

  const { data: session, status } = useSession();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // click event handler
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#user-button')) { // close menu if not clicking the user button
      setIsMenuOpened(false);
    }
  }

  return (
    <>

      <div className={`border-b border-slate-200 pl-5 py-3 pr-3 flex sticky top-0 z-50 bg-white justify-between items-center w-full box-border`}>
        
        {/* logo */}
        <Link className="flex items-center" href={'/'}>
          <div className="font-logo text-lg ml">DanielIssues</div>
        </Link>
        
        {/* nav menu / login button */}
        {status !== 'loading' && <div className="flex items-center">
          {session ?
            <nav>
              {/* new post button */}
              <Link className="w-7 h-7 rounded p-0 flex justify-center items-center" href={'/newpost'}><Image src={'/icon-plus.svg'} height={16} width={16} alt="" /></Link>
              {/* user button */}
              <div id="user-button" className="relative rounded-full overflow-hidden w-7 h-7" onClick={() => setIsMenuOpened(!isMenuOpened)}>
                <Image src={session.user?.image || ''} alt="" height={28} width={28} />
              </div>
            </nav>
            :
            <button className="primary-button ml-4" onClick={() => signIn('github')}>Log in</button>}
        </div>}

      </div>


      {/* menu */}
      {<menu className={`${isMenuOpened ? '' : 'hidden '}fixed bg-white shadow py-1 border border-slate-200 rounded top-14 right-7 flex flex-col`}>
        <Link href={'/profile'}><Image src={'/icon-user.svg'} alt="" height={14} width={14} />Profile</Link>
        <button onClick={() => signOut()}><Image src={'/icon-logout.svg'} alt="" height={14} width={14} />Log out</button>
      </menu>}

    </>
  );
}

export default Navbar;