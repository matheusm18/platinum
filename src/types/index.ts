export type UserPublic = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
};

export type User = UserPublic & {
  email: string;
  createdAt: Date;
};

export type Game = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
  genres: string[];
  releaseYear: number;
  averageScore: number | null;
};

export type GameDetail = Game & {
  description: string;
  platforms: string[];
  developers: string[];
  publishers: string[];
  playtime: number | null;
  website: string | null;
};

export type Review = {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  content: string | null;
  createdAt: Date;
};