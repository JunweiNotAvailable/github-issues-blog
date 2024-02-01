import NextAuth from 'next-auth/next';
import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions:AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
  ],
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };