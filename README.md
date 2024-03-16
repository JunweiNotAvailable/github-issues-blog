# IssuesBlog

This is a blog app built with [Next.js](https://nextjs.org). Visit it here: https://issuesblog.vercel.app

<img height="324" alt="desktop" src="https://github.com/JunweiNotAvailable/issuesblog/assets/89463326/b75fa64a-651a-4ac5-bc90-5dbd2f442d1b">
<img height="324" alt="mobile" src="https://github.com/JunweiNotAvailable/issuesblog/assets/89463326/3fe0360f-79dd-461a-b538-0f15b3dddc08">

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
6. [**Improvement**](https://github.com/JunweiNotAvailable/issuesblog/#improvement)
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
1. Clone the Repository: `git clone https://github.com/JunweiNotAvailable/issuesblog`
2. Navigate to the project directory: `cd issuesblog`
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
### page.server.tsx (Server)
- Use server components to get the data, and pass the fetched data to the client.
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

## Improvement

### Server-side rendering
1. I used server components to fetch data and pass the data to client components, which didn't improve SEO. A better approach is to render the elements in server components and use client components when using client side actions like `useEffect`, `useState`, etc.

### Code management
2. Although some elements were created as components, there are much more elements that can be made as components to improve  **efficiency**, **reusability** and **readability**.
3. The code and comments should be more clear and understandable for collaboration or future use.
