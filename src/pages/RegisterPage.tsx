import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { loginApi, registerApi } from "../api/auth";
import useAuthStore from "../store/authStore";
import { registerSchema } from "../schemas/authSchema";
import type { RegisterFormValues } from "../schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "" },
  });

  const signUp = useMutation({
    // Register only creates the account -- login is the route that
    // signs a token -- so log in right after it.
    mutationFn: async (values: RegisterFormValues) => {
      await registerApi(values);
      return loginApi({ email: values.email, password: values.password });
    },
    onSuccess: ({ token, user }) => {
      login(token, user);
      navigate("/items");
    },
  });

  const onSubmit = (values: RegisterFormValues): void => {
    signUp.mutate(values);
  };

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        Register
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            {...register("name")}
            aria-invalid={errors.name ? true : undefined}
            placeholder="Juan Dela Cruz"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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

        <Button type="submit" disabled={signUp.isPending} className="justify-self-start">
          {signUp.isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* The API's own message, e.g. "That email is already registered". */}
      {signUp.isError && (
        <p className="mt-4 text-sm text-red-700">{signUp.error.message}</p>
      )}

      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Have an account?{" "}
        <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
