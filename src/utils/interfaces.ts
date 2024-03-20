export interface User {
  id: string;
  name: string;
  login: string
  avatar_url: string
}

export interface Repository {
  id: number;
  name: string;
}

export interface Post {
  repository_url: string
  number: string
  title: string
  updated_at: string
  id: string
  body: string
  labels: PostLabel[]
  comments: number
}

export interface PostLabel {
  name: string
  color: string
}

export interface Comment {
  user: User
  updated_at: string
  body: string
}