import { getTimeFromNow } from "@/utils/functions";
import { getUser } from "@/utils/github";
import MarkdownEditor from "@uiw/react-markdown-editor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from '../styles/post.module.css';

interface Props {
  comment: any
}

const CommentItem: React.FC<Props> = ({ comment }) => {
  console.log(comment)

  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);

  // get user data
  useEffect(() => {
    (async () => setUser(await getUser(comment.user.login)))();
  }, []);

  return (
    <div className="p-4 border-t hover:bg-slate-200">
      {/* header - picture, user, time */}
      <div className="flex items-center">
        <div className="w-10 h-10 overflow-hidden rounded-full border cursor-pointer" onClick={() => router.push(`/${comment.user.login}`)}>
          <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={comment.user.avatar_url} width={512} height={512} />
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div className="text-sm hover:underline font-bold cursor-pointer" onClick={() => router.push(`/${comment.user.login}`)}>{user?.name || comment.user.login}</div>
            <div className="text-xs text-slate-400 ml-2">{getTimeFromNow(comment.updated_at)}</div>
          </div>
          <div className="text-xs text-slate-400">{comment.user.login}</div>
        </div>
      </div>
      {/* comment body */}
      <div className="mt-2">
        <MarkdownEditor.Markdown className={styles.markdownContent} source={comment.body} />
      </div>
    </div>
  );
}
 
export default CommentItem;