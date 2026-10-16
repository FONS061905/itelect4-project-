import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { loginApi, registerApi } from "../api/auth";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const submit = useMutation({
    mutationFn: async () => {
      // Register only creates the account, so log in right after it.
      if (mode === "register") {
        await registerApi({ name, email, password });
      }
      return loginApi({ email, password });
    },
    onSuccess: ({ token, user }) => {
      login(token, user); // 1. put the real JWT + user in the store
      navigate("/items"); // 2. then send them to their items
    },
  });

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    submit.mutate();
  };

  const inputClass =
    "w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
            className={inputClass}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={inputClass}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className={inputClass}
        />
        {submit.isError && (
          <p className="text-sm text-red-700">{submit.error.message}</p>
        )}
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submit.isPending ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
      <button
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          submit.reset();
        }}
        className="mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        {mode === "login" ? "No account yet? Register" : "Have an account? Log in"}
      </button>
    </div>
  );
}

export default LoginPage;
