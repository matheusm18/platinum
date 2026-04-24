export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
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

export type Review = {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  content: string | null;
  createdAt: Date;
};