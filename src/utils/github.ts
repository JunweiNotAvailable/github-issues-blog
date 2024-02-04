import axios from 'axios';
import { getRandomItems } from './functions';

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

// update an issue on github
export const updateIssue = async (username: string, repo: string, issueId: string, data: any) => {
  try {
    await axios.patch(`https://api.github.com/repos/${username}/${repo}/issues/${issueId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error('Error updating the issue:', error);
  }
}

// get issues (any)
export const getIssues = async (page: number) => {
  const minDate = new Date();
  minDate.setHours(minDate.getHours() - page);
  const data = (await axios.get(`https://api.github.com/search/issues?q=is:open+created:>${minDate.toISOString()}&sort=random&order=desc&per_page=10`, { 
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  })).data;
  return data.items;
}

// get issues of given user
export const getUserIssues = async (username: string, page: number) => {
  const data = (await axios.get(`https://api.github.com/search/issues?q=author:${username}+is:open&sort=updated&order=desc&per_page=10&page=${page}`, { 
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  })).data;
  return data.items;
}

// get single issue by id
export const getIssue = async (username: string, repo: string, issue: string) => {
  const data = (await axios.get(`https://api.github.com/repos/${username}/${repo}/issues/${issue}`, { 
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  })).data;
  return data;
}