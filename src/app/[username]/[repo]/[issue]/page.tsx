import { getIssue, getOwnerAndName, getUser, getUserFromUrl } from '@/utils/github';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import PostClient from './page.client';
import Link from 'next/link';

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
      <PostClient owner={owner} authUser={authUser} post={post} comments={comments} />
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