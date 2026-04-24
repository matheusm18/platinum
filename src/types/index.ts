export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
};

export type Review = {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  content: string | null;
  createdAt: Date;
};
