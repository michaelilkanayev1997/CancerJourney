export interface Avatar {
  url: string;
  publicId: string;
}

export interface User {
  _id: string;
  name: string;
  avatar: Avatar;
  userType: string;
}

export interface Like {
  _id: string;
  userId: User;
  createdAt: string;
}

export interface Reply {
  _id: string;
  owner: User;
  description: string;
  likes: Like[];
  createdAt: string;
}

export interface Post {
  _id: string;
  image: {
    public_id: string;
    url: string;
  };
  owner: User;
  description: string;
  likes: Like[];
  replies: Reply[];
  createdAt: string;
  forumType: string;
}
