import axios from 'axios';

// Github access token
export const accessToken = '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';

// get user id from the image url
export const getUserId = (url: string) => {
  return (url.match(/u\/(.*?)\?v/) || [])[1];
}

// return user data from given username
export const getUser = async (username: string) => {
  const user = await axios.get(`https://api.github.com/users/${username}`);
  return user.data;
}

// return user data from the image url
export const getUserFromUrl = async (url: string) => {
  const userId = getUserId(url);
  const user = await axios.get(`https://api.github.com/user/${userId}`);
  return user.data;
}

// get user's repos
export const getUserRepos = async (username: string) => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    throw error;
  }
};

// create an issue on github
export const postIssue = async (username: string, repo: string, title: string, body: string, labels: { name: string, color: string }[]) => {
  try {
    const response = await axios.post(`https://api.github.com/repos/${username}/${repo}/issues`, { title, body, labels }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

// get issues (any)
export const getIssues = async (page: number) => {
  const data = (await axios.get(`https://api.github.com/search/issues?q=is:open&sort=updated&order=desc&per_page=10&page=${page}`)).data;
  return data.items;
}

// get issues of given user
export const getUserIssues = async (username: string, page: number) => {
  const data = (await axios.get(`https://api.github.com/search/issues?q=author:${username}+is:open&sort=updated&order=desc&per_page=10&page=${page}`)).data;
  return data.items;
}