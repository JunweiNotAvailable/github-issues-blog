"use client"

import Link from "next/link";
import Footer from "./Footer";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { labels } from "@/utils/constants";

const MainSidebar = () => {

  const [isLabelsOpened, setIsLabelsOpened] = useState(true); // status of labels list - open/close

  return (
    <aside className="border-slate-200 px-1 flex flex-col box-border overflow-auto sticky top-14">
      <div className="flex-1 flex flex-col">
        {/* home */}
        <Link href={'/'} className="sidebar-button"><Image src={'/icon-home.svg'} alt="" height={16} width={16}/><span>Home</span></Link>
        {/* labels */}
        <div className={`flex items-center sidebar-button relative top-0${isLabelsOpened ? ' sticky' : ''}`} onClick={() => setIsLabelsOpened(!isLabelsOpened)}>
          <Image className="-rotate-45" src={'/icon-label.svg'} alt="" height={16} width={16}/><span>Labels</span>
          <FontAwesomeIcon icon={faAngleDown} className={`${isLabelsOpened ? '' : '-rotate-180'} text-xs absolute top-1/2 right-4 -translate-y-1/2`} />
        </div>
        {/* labels list */}
        <div className={`sidebar-list${isLabelsOpened ? ' open' : ''} flex flex-col ml-3 pl-1 border-l overflow-hidden`}>
          {labels.map((label, i) => <Link key={`label-${label}`} className="sidebar-button text-xs" href={`/labels/${label}`}>{label}</Link>)}
        </div>
      </div>
      <Footer />
    </aside>
  );
}
 
export default MainSidebar;