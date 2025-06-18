import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchPost, fetchComments, createComment } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Props {
  boardId: number;
  postId: number;
}

const PostDetailContent = ({ boardId, postId }: Props) => {
  const postQuery = useQuery({
    queryKey: ["post", boardId, postId],
    queryFn: () => fetchPost(boardId, postId),
  });

  const commentsQuery = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { isAuthenticated, accessToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const schema = z.object({
    content: z.string().min(1, "Enter comment"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      createComment(postId, values, accessToken ?? undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      form.reset();
      toast.success("Comment posted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (values: FormValues) => mutation.mutate(values);

  const post = postQuery.data;
  const comments = commentsQuery.data ?? [];

  if (postQuery.isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!post) {
    return <div className="p-6">Post not found.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            {post.author.username} •{" "}
            {new Date(post.created_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Attachments</h3>
              <ul className="space-y-1">
                {post.files.map((file) => (
                  <li key={file.id}>
                    <a
                      href={`/api/v1/files/${file.id}/download`}
                      className="text-blue-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>{file.filename ?? `File ${file.id}`}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          {commentsQuery.isLoading && <p>Loading comments...</p>}
          {!commentsQuery.isLoading && comments.length === 0 && (
            <p className="text-sm text-gray-400">No comments.</p>
          )}
          <ScrollArea className="max-h-72 space-y-4 pr-4">
            {comments.map((c) => (
              <div
                key={c.id}
                className="pb-2 border-b border-gray-700 last:border-none"
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {c.author.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">
                      {c.author.username} •{" "}
                      {new Date(c.created_at).toLocaleString()}
                    </p>
                    <p className="whitespace-pre-wrap mt-1">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
          {isAuthenticated ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? "Posting..." : "Post"}
                </Button>
              </form>
            </Form>
          ) : (
            <p className="mt-4 text-sm text-gray-400">Login to comment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetailContent;
