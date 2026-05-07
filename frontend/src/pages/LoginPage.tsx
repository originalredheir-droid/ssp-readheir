import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loginWithGoogle, loading } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await login({ username: email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-[#181818] p-8 shadow-lg shadow-black/20">
      <h1 className="mb-4 text-3xl font-semibold text-white">Sign in disabled</h1>
      <p className="mb-6 text-slate-400">
        Login and registration are temporarily disabled so you can preview the app interface.
      </p>
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
        Use the top navigation to explore the app pages without signing in.
      </div>
    </section>
  );
};

export default LoginPage;
