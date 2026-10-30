import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginApi } from "../api/auth";
import useAuthStore from "../store/authStore";
import { loginSchema } from "../schemas/authSchema";
import type { LoginFormValues } from "../schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const logIn = useMutation({
    mutationFn: loginApi,
    onSuccess: ({ token, user }) => {
      login(token, user); // 1. put the real JWT + user in the store
      navigate("/items"); // 2. then send them to their items
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    logIn.mutate(values);
  };

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={errors.email ? true : undefined}
            placeholder="juan@dlsl.edu.ph"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={errors.password ? true : undefined}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" disabled={logIn.isPending} className="justify-self-start">
          {logIn.isPending ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {/* The API's own message, e.g. "Email or password is incorrect". */}
      {logIn.isError && (
        <p className="mt-4 text-sm text-red-700">{logIn.error.message}</p>
      )}

      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        No account yet?{" "}
        <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400">
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
