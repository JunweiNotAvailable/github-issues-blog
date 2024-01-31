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

// create an issue on github
export const postIssue = async (username: string, repo: string, title: string, body: string, labels: { name: string, color: string }[]) => {
  try {
    const response = await axios.post(`https://api.github.com/repos/${username}/${repo}/issues`, { title, body, labels }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response)
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}