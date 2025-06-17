import { useQuery } from '@tanstack/react-query';
import { fetchPost, fetchComments } from '@/lib/api';

interface Props {
  boardId: number;
  postId: number;
}

const PostDetailContent = ({ boardId, postId }: Props) => {
  const postQuery = useQuery({
    queryKey: ['post', boardId, postId],
    queryFn: () => fetchPost(boardId, postId),
  });

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });

  const post = postQuery.data;
  const comments = commentsQuery.data ?? [];

  if (postQuery.isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!post) {
    return <div className="p-6">Post not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-gray-400">
            {post.author.username} • {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
        <p className="whitespace-pre-wrap mb-4">{post.content}</p>
        {post.files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Attachments</h3>
            <ul className="list-disc list-inside text-blue-400">
              {post.files.map((file) => (
                <li key={file.id}>
                  <a
                    href={`/api/v1/files/${file.id}/download`}
                    className="hover:underline"
                  >
                    {file.filename ?? `File ${file.id}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {commentsQuery.isLoading && <p>Loading comments...</p>}
        {!commentsQuery.isLoading && comments.length === 0 && <p>No comments.</p>}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="border-b border-gray-700 pb-2">
              <p className="text-sm text-gray-400">
                {c.author.username} • {new Date(c.created_at).toLocaleString()}
              </p>
              <p className="whitespace-pre-wrap mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailContent;
