type Props = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">@{username}</h1>
      <p className="mt-2 text-zinc-400">User profile coming soon.</p>
    </div>
  );
}