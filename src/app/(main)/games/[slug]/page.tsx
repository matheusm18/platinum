type Props = {
  params: Promise<{ slug: string }>;
};

export default async function GamePage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">{slug}</h1>
      <p className="mt-2 text-zinc-400">Game details coming soon.</p>
    </div>
  );
}