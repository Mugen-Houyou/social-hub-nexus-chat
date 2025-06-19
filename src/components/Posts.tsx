import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBoards, fetchPostsByBoard, PostSummary } from '@/lib/api';
import CreatePostDialog from './CreatePostDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PostDetailContent from './PostDetailContent';

const Posts = () => {
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostSummary | null>(null);

  const boardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  const postsQuery = useQuery({
    queryKey: ['posts', activeBoard],
    queryFn: () => (activeBoard !== null ? fetchPostsByBoard(activeBoard) : Promise.resolve([])),
    enabled: activeBoard !== null,
  });

  useEffect(() => {
    if (!boardsQuery.isLoading && boardsQuery.data && activeBoard === null) {
      const first = boardsQuery.data[0];
      if (first) setActiveBoard(first.id);
    }
  }, [boardsQuery.isLoading, boardsQuery.data, activeBoard]);

  const boards = boardsQuery.data ?? [];
  const posts = postsQuery.data ?? [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">게시판</h1>
          <p className="text-gray-400 mt-1">커뮤니티 멤버들과 소통하세요</p>
        </div>
        {activeBoard !== null && <CreatePostDialog boardId={activeBoard} />}
      </div>

      <div className="flex space-x-4 mb-6">
        {boardsQuery.isLoading && <span>Loading...</span>}
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => setActiveBoard(board.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeBoard === board.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {board.name} ({board.posts})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {postsQuery.isLoading && <p>Loading posts...</p>}
        {!postsQuery.isLoading && posts.length === 0 && <p>게시물이 없습니다.</p>}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">{post.author.username}</h3>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                <h2 className="text-lg font-medium mb-2">{post.title}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={selectedPost !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPost(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          {selectedPost && (
            <PostDetailContent
              boardId={selectedPost.board_id}
              postId={selectedPost.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Posts;
