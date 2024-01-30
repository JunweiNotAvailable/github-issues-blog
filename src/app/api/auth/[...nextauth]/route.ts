import NextAuth from 'next-auth/next';
import { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions:AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     return { ...token, ...user }
  //   },
  //   async session({ session, token, user }) {
  //     session.user = token;
  //     return session
  //   },
  // }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };