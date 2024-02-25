import axios from 'axios';

// Github access token
export const accessToken = process.env.accessToken as string;

// get user id from the image url
export const getUserId = (url: string) => {
  return (url.match(/u\/(.*?)\?v/) || [])[1];
}

// return user data from given username
export const getUser = async (username: string) => {
  try {
    const user = await axios.get(`https://api.github.com/users/${username}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    return user.data;
  } catch (error) {
    console.log(error);
  }
}

// return user data from the image url
export const getUserFromUrl = async (url: string) => {
  try {
    const userId = getUserId(url);
    const user = await axios.get(`https://api.github.com/user/${userId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    return user.data;
  } catch (error) {
    console.log(error);
  }
}

// Get repo owner and repo name from given url
export const getOwnerAndName = (url: string): { owner: string; name: string } | null => {
  const match = url.match(/https:\/\/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)/);
  return match ? { owner: match[1], name: match[2] } : null;
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

// get users whose usernames contain given string 
export const searchUsers = async (partialName: string, page: number) => {
  try {
    const response = await axios.get(`https://api.github.com/search/users`, {
      params: {
        q: `${partialName} in:login`,
        page: page,
        per_page: 10
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.items;
  } catch (error) {
    console.error(error);
  }
};

// get issues number of given label
export const getLabelCount = async (label: string) => {
  try {
    return (await axios.get(`https://api.github.com/search/issues?q=label:"${label}"&per_page=1`, { headers: { Authorization: `Bearer ${accessToken}` } })).data.total_count;
  } catch (error) {
    console.log(error)
  }
}

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

// delete a post -> close an issue on github
export const closeIssue = async (username: string, repo: string, issueId: string) => {
  try {
    await axios.patch(`https://api.github.com/repos/${username}/${repo}/issues/${issueId}`,
      { state: 'closed' },
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

// get given user's issues
export const getUserIssues = async (username: string, page: number) => {
  try {
    const data = (await axios.get(`https://api.github.com/search/issues?q=user:${username}+is:open&sort=updated&order=desc&per_page=10&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    })).data;
    return { issues: data.items, totalCount: data.total_count };
  } catch (error) {
    console.log(error)
  }
}

// get single issue by id
export const getIssue = async (username: string, repo: string, issue: string) => {
  try {
    const data = (await axios.get(`https://api.github.com/repos/${username}/${repo}/issues/${issue}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    })).data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

// get labelled issues
export const getLabelledIssues = async (label: string, page: number) => {
  try {
    return (await axios.get(`https://api.github.com/search/issues?q=label:"${label}"&per_page=10&page=${page}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })).data.items;
  } catch (error) {
    console.log(error);
  }
}