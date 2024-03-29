# Github Issues Blog

This is a blog app built with [Next.js 14](https://nextjs.org). Visit it here: https://issuesblog.vercel.app

<img height="324" alt="desktop" src="https://github.com/JunweiNotAvailable/nextjs-blog/assets/89463326/b6d21dc0-ff34-4597-a3c8-124df647f68b">
<img height="324" alt="mobile" src="https://github.com/JunweiNotAvailable/github-issues-blog/assets/89463326/688a82cf-156c-41b8-971e-a240e38fc41f">

## Overview
1. [**What does it do?**](https://github.com/JunweiNotAvailable/issuesblog/#what-does-it-do)
2. [**Quick start**](https://github.com/JunweiNotAvailable/issuesblog/#quick-start)
   - [Public URL](https://github.com/JunweiNotAvailable/issuesblog/#public-url)
   - [On your computer](https://github.com/JunweiNotAvailable/issuesblog/#on-your-computer)
3. [**App architecture**](https://github.com/JunweiNotAvailable/issuesblog/#app-architecture)
   - [layout.tsx](https://github.com/JunweiNotAvailable/issuesblog/#layouttsx)
   - [page.tsx](https://github.com/JunweiNotAvailable/issuesblog/#pagetsx)
   - [[username]/page.tsx](https://github.com/JunweiNotAvailable/issuesblog/#usernamepagetsx)
   - [[username]/[repo]/[issue]/page.tsx](https://github.com/JunweiNotAvailable/issuesblog/#usernamerepoissuepagetsx)
   - [newpost/page.tsx](https://github.com/JunweiNotAvailable/issuesblog/#newpostpagetsx)
   - [Components](https://github.com/JunweiNotAvailable/issuesblog/#components)
4. [**Server Components**](https://github.com/JunweiNotAvailable/issuesblog/#server-components)
   - [page.tsx (Server)](https://github.com/JunweiNotAvailable/issuesblog/#pagetsx-server)
   - [Client Components](https://github.com/JunweiNotAvailable/issuesblog/#client-components)
6. [**Improvement**](https://github.com/JunweiNotAvailable/issuesblog/#improvement)
   - [Server-side rendering](https://github.com/JunweiNotAvailable/issuesblog/#server-side-rendering)
   - [Code management](https://github.com/JunweiNotAvailable/issuesblog/#code-management)

## What does it do?
1. Allow users to browse other Github user's [Github issues](https://github.com/features/issues) as their posts
2. Users can Manage their posts (**add**/**update**/**delete**) on it
3. **Infinite scroll** when browsing

## Quick start
### Public URL
This app is available on https://issuesblog.vercel.app
### On your computer
To start this project on your computer:
1. Clone the Repository: `git clone https://github.com/JunweiNotAvailable/github-issues-blog`
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Open http://localhost:3000 on your browser

## App architecture
### [layout.tsx](https://github.com/JunweiNotAvailable/issuesblog/blob/master/src/app/layout.tsx) 
1. Add [Navbar](https://github.com/JunweiNotAvailable/issuesblog/tree/master/src/components/Navbar.tsx) to every page
2. Wrap the app with [AuthProvider](https://github.com/JunweiNotAvailable/issuesblog/blob/master/src/app/provider.tsx)
```jsx
<NextAuthProvider>
  <div className='flex flex-col min-h-full'>
    <Navbar />
    {children}
  </div>
</NextAuthProvider>
```
### [page.tsx](https://github.com/JunweiNotAvailable/issuesblog/blob/master/src/app/page.tsx)
This is the home page with route `/`
1. Contains a login button if no user authenticated
2. Redirects to user's profile page if user is logged in
### [[username]/page.tsx](https://github.com/JunweiNotAvailable/issuesblog/blob/master/src/app/%5Busername%5D/page.tsx)
User's profile page, route: `/<Github's username>`
- Loads the first 10 posts of the user, and get another 10 when scrolling to bottom

### [[username]/[repo]/[issue]/page.tsx](https://github.com/JunweiNotAvailable/issuesblog/blob/master/src/app/%5Busername%5D/%5Brepo%5D/%5Bissue%5D/page.tsx)
Here comes the post page: `/<username>/<repo name>/<issue ID>`
- With `username`, `repo`, `issue_id` these 3 parameters to fetch the post with [Github REST API](https://docs.github.com/en/rest)
- Display the post and the comments

### [newpost/page.tsx](https://github.com/JunweiNotAvailable/issuesblog/blob/master/src/app/newpost/page.tsx)
Where you can add a new post, route: `/newpost`
- This is the page **where only logged in users can access**. You can't create a post as nobody, right?
- With 3 inputs, **repo**, **title** and **body**, labels are optional

### [Components](https://github.com/JunweiNotAvailable/issuesblog/tree/master/src/components)
These are components been independent for optimization.

They were wrapped by `React.memo` to prevent re-rendering.

- [Navbar.tsx]()
  - Contains the **logo**, **users searchbar** and **user picture/login button** on the top of the screen
- [SearchUser.tsx]()
  - The component of the user on the searchbar results list
- [MarkdownEditor.tsx]()
  - This is a custom Markdown editor
  - With custom buttons, preview button
  - Powered by [uiw/react-md-editor](https://uiwjs.github.io/react-md-editor/)
- [PostItem.tsx]()
  - The post item on the user's profile page
  - Contains user, post title and post body
- [CommentItem.tsx]()
  - The comment item on the post contains the sender's info and comment body

## Server Components
### page.tsx (Server)
Use server components to **fetch data**, **render HTML**. And **use client components when client actions are need**, such as `useEffect`, `useState`, etc.
```jsx
const App = async () => {
   // Fetch data in the server component
   try {
      const response = await fetch('...');
      const data = await response.json();
      if (data) {
         return (
            <div className="app">
               ...
               {/* Use client component to handle client events */}
               <LoginButton />
            </div>
         )
      }
   } catch (error) {
      console.log('Failed fetching data:', error);
   }

   return (
      <div>Data not found</div>
   )
}

export default App;
```

### Client Components
A component in Next.js above the version 13 is regarded as a server component by default, add `'use client'` on the top will make it a **client component**.
```jsx
'use client'

const LoginButton = () => {

   const handleClick = async () => {
      await login();
   }

   return (
      <button onClick={handleClick}>Login</button>
   )
}

export default LoginButton;
```

## Improvement

### Server-side rendering
While I put some HTML in the server components, there are much code still rendered on the client side. To optimize it, the HTML should be rendered on the server side as much as possible.

### Code management
Although some elements were created as components, I believe there are more elements that can be wrapped as components to improve efficiency, reusability and readability.
