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

const CommentItem: React.FC<Props> = React.memo(({ comment }) => {

  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);

  // get user data
  useEffect(() => {
    (async () => setUser(await getUser(comment.user.login)))();
  }, []);

  return (
    <div className="py-8 border-t">
      {/* header - picture, user, time */}
      <div className="flex items-center cursor-pointer" onClick={() => router.push(`/${comment.user.login}`)}>
        <div className="w-10 h-10 overflow-hidden rounded-full border">
          <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={comment.user.avatar_url} width={512} height={512} />
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div className="text-sm font-bold">{user?.name || comment.user.login}</div>
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
})

CommentItem.displayName = 'CommentItem';

export default CommentItem;