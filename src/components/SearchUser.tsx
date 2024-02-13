import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  user: any
  setIsShowingResults: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchUser: React.FC<Props> = React.memo(({ user, setIsShowingResults }) => {

  const router = useRouter();

  return (
    <div className="flex items-center cursor-pointer my-1 hover:bg-slate-100 py-2 px-3" onClick={() => {
      router.push(`/${user?.login}`)
      setIsShowingResults(false);
    }}>
      <div className={`w-8 h-8 overflow-hidden rounded-full border`}>
        <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={user.avatar_url} width={512} height={512} />
      </div>
      <div className="text-sm ml-2 font-bold flex-1 min-w-0 overflow-hidden text-ellipsis">{user?.login}</div>
    </div>
  )
})

SearchUser.displayName = 'SearchUser';

export default SearchUser