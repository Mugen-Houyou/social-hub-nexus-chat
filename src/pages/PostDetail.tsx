import { useParams, Link } from 'react-router-dom';
import PostDetailContent from '@/components/PostDetailContent';

const PostDetail = () => {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();

  if (!boardId || !postId) {
    return <div className="p-6">Invalid post</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Link to="/" className="text-blue-400 hover:underline">
        &larr; Back
      </Link>
      <PostDetailContent boardId={Number(boardId)} postId={Number(postId)} />
    </div>
  );
};

export default PostDetail;

