import { getIssue, getOwnerAndName, getUser, getUserFromUrl } from '@/utils/github';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import Link from 'next/link';
import Image from 'next/image';
import { getTimeFromNow } from '@/utils/functions';
import CommentItem from '@/components/CommentItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import PostBody from './PostBody';

const Post = async ({ params }: any) => {

  const session = await getServerSession();
  const { username, repo, issue } = params;

  try {
    const post = await getIssue(username as string, repo as string, issue as string);
    const owner = await getUser(getOwnerAndName(post.repository_url)?.owner as string);
    let authUser = null;
    if (session) {
      const name = (await getUserFromUrl(session.user?.image as string)).login;
      authUser = await getUser(name);
    }
    const commentsFetchData = (await axios.get(`${post.comments_url}`)).data;
    const comments = commentsFetchData.sort((a: any, b: any) => a.updated_at < b.updated_at ? 1 : -1);
    return (
      <div className="flex justify-center pb-16 px-4">
        <div className="w-full" style={{ maxWidth: 720 }}>
          {/* picture, name and time */}
          <div className={`justify-between items-start flex mt-8`}>
            <Link className="flex items-center cursor-pointer" href={`/${owner.login}`}>
              <div className={`w-10 h-10 overflow-hidden rounded-full border`}>
                <Image className="w-full h-full overflow-hidden rounded-full" alt="" src={owner.avatar_url} width={512} height={512} />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <div className={"text-sm font-bold"} >{owner.name || owner.login}</div>
                  <div className="text-xs text-slate-400 ml-2">{getTimeFromNow(post.updated_at)}</div>
                </div>
                <div className="text-xs text-slate-400">{post.repository_url.replace('https://api.github.com/repos/', '')}</div>
              </div>
            </Link>
          </div>
          <PostBody authUser={authUser} owner={owner} post={post} />

          {/* comments */}
          <div className="mt-8">
            <div className="text-slate-400 text-sm py-2 font-bold mx-4"><FontAwesomeIcon className="mr-2" icon={faComment} />{post.comments} Comment{post.comments === 1 ? '' : 's'}</div>
            <div>
              {comments.map((comment: any, i: number) => <CommentItem
                key={`comment-${i}`}
                comment={comment}
              />)}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  return (
    <div className='flex-1 justify-center items-center flex flex-col'>
      <div className='font-bold'>Page not found :(</div>
      <Link href={'/'} className='underline mt-2'>Go to home</Link>
    </div>
  );
}

export default Post;