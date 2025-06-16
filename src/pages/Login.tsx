import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const schema = z.object({
  username: z.string().min(1, 'Enter username'),
  password: z.string().min(1, 'Enter password'),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: auth.login,
    onSuccess: () => {
      navigate('/');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded-md shadow">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-500 hover:text-blue-700 underline">
                Register
              </a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
