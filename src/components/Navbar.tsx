"use client"

import { removeDuplicate } from "@/utils/functions";
import { getUserFromUrl, searchUsers } from "@/utils/github";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Spinner from "./Spinner";

const Navbar = () => {

  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  // search users data
  const [resultUsers, setResultUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [isShowingResults, setIsShowingResults] = useState(false);

  // load more data when page updated
  useEffect(() => {
    if (!searchInput) return; // return when no input
    if (page === 1 && !firstSearch) return; // return if first page
    (async () => {
      setFirstSearch(false);
      setIsLoadingData(true);
      const users = await searchUsers(searchInput, page);
      if (!users) return;
      if (users?.length === 0) { // no more data
        setIsLastPage(true);
        setIsLoadingData(false);
        return;
      }
      setResultUsers(prev => removeDuplicate([...prev, ...users]));
      setIsLoadingData(false);
    })();
  }, [page]);

  // reset page when first search
  useEffect(() => {
    if (firstSearch) setPage(1);
  }, [firstSearch]);

  // fetch user data 
  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        setUsername((await getUserFromUrl(session.user?.image as string)).login);
      })();
    }
  }, [status]);


  // click event handler
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('#user-button')) { // close menu if not clicking the user button
      setIsMenuOpened(false);
    }
    if (!target.closest('.users-result-dropdown') && !target.closest('.search-input-container')) { // close users result
      setIsShowingResults(false);
    }
  };

  // register click event
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // handle scroll on user result dropdown
  const handleScroll = (e: React.UIEvent) => {
    const target = e.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    // load more data if scroll to bottom
    if (Math.abs(scrollHeight - (scrollTop + clientHeight)) < 5) {
      // only load if there are more data
      if (!isLastPage && !isLoadingData) {
        setPage(page + 1);
      }
    }
  }

  // handle key down on input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      resetAndSearch();
    }
  }

  // reset users result and search for new users
  const resetAndSearch = () => {
    setResultUsers([]);
    setFirstSearch(true);
    setIsLastPage(false);
    setIsLoadingData(false);
    setPage(0);
    setIsShowingResults(true);
  }

  return (
    <>

      <div className={`border-b border-slate-200 pl-5 pr-3 flex sticky top-0 z-50 bg-white justify-between items-center w-full box-border h-14`}>
        {/* logo */}
        <Link className="flex items-center" href={'/'}>
          <Image src={'/logo.png'} alt="" height={24} width={24} unoptimized={true} />
          <div className="hidden md:block font-logo text-lg ml-2">IssuesBlog</div>
        </Link>
        {/* search input */}
        <div className="flex-1 relative ml-2 md:ml-0 w-1/2" style={{ maxWidth: 280 }}>
          <div className="search-input-container w-full relative">
            <input className="search-input w-full outline outline-2 focus:outline-slate-200" placeholder="Search user" value={searchInput} onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
            <button className="no-hover absolute right-0 top-1/2 -translate-y-1/2 font-bold text-sm py-1 px-3" style={{ color: 'var(--color-primary-blue)' }} onClick={resetAndSearch}>Search</button>
          </div>
          {/* search results */}
          {(searchInput.length > 0 && isShowingResults) && <div className="users-result-dropdown scroller absolute w-full top-full mt-1 z-30 bg-white border border-slate-200 box-border shadow rounded max-h-64" onScroll={handleScroll}>
            {resultUsers.length === 0 && isLastPage && !isLoadingData ?
              <div className="text-center py-2 text-sm font-bold text-gray-400">No user found :(</div>
              :
              resultUsers.map((result, i) => <div key={`user-${i}`} className="flex items-center cursor-pointer my-1 hover:bg-slate-100 py-2 px-3" onClick={() => {
                router.push(`/${result.login}`)
                setIsShowingResults(false);
              }}>
                <div className={`w-8 h-8 overflow-hidden rounded-full border`}>
                  <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={result.avatar_url} width={512} height={512} />
                </div>
                <div className="text-sm ml-2">{result?.login}</div>
              </div>)}
              {/* loading */}
              {isLoadingData && <div className="flex justify-center py-2"><Spinner size={24} /></div>}
          </div>}
        </div>
        {/* nav menu / login button */}
        {status !== 'loading' && <div className="flex items-center">
          {username ?
            <nav>
              {/* new post button */}
              <Link className="w-7 h-7 rounded p-0 flex justify-center items-center" href={'/newpost'}><Image src={'/icon-plus.svg'} height={16} width={16} alt="" /></Link>
              {/* user button */}
              <div id="user-button" className="relative rounded-full overflow-hidden w-7 h-7 border" onClick={() => setIsMenuOpened(!isMenuOpened)}>
                <Image src={session?.user?.image || ''} alt="" height={28} width={28} />
              </div>
            </nav>
            :
            <button className="black-button ml-4 text-sm py-1 px-4" onClick={() => signIn('github')}>Log in</button>}
        </div>}
      </div>

      {/* menu */}
      {<menu className={`${isMenuOpened ? '' : 'hidden '}fixed bg-white shadow py-1 border border-slate-200 rounded top-14 right-7 flex flex-col`}>
        <Link href={`/${username}`}><Image src={'/icon-user.svg'} alt="" height={14} width={14} />Profile</Link>
        <button onClick={() => signOut()}><Image src={'/icon-logout.svg'} alt="" height={14} width={14} />Log out</button>
      </menu>}

    </>
  );
};

export default Navbar;