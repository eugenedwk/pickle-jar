import { getAllPostIds, getPostData } from "../../../lib/posts";

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }: { params: { id: string[] } }) {
  const postData = await getPostData(params.id);
  return (
    <article className="flex min-h-screen flex-col items-center justify-center bg-green-900 text-white">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-4xl font-bold text-green-200">
          {postData.title}
        </h1>
        <div className="mb-6 text-sm text-green-300">{postData.date}</div>
        <div
          className="prose prose-invert prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </div>
    </article>
  );
}
