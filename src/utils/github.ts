import axios from 'axios';

// Github access token
export const accessToken = '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';

// get user id from the image url
export const getUserId = (url: string) => {
  return (url.match(/u\/(.*?)\?v/) || [])[1];
}

// get user data and return the username from the image url
export const getUsername = async (url: string) => {
  const userId = getUserId(url);
  const user = await axios.get(`https://api.github.com/user/${userId}`);
  return user.data.login;
}

// get user's repos
export const fetchUserRepos = async (username: string) => {
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