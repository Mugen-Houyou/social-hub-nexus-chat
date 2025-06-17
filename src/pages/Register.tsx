import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod';
import { signup as registerUser } from '@/lib/api';
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
  firstname: z.string().min(1, 'Enter first name'),
  lastname: z.string().min(1, 'Enter last name'),
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Enter password'),
});

type FormValues = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful');
      navigate('/login');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-sm bg-gray-800 p-6 rounded-md shadow border border-gray-700">
        <h1 className="text-xl font-bold mb-4">Register</h1>
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
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
              {mutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
