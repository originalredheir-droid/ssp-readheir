import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await loginUser({ username, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-[#181818] p-8 shadow-lg shadow-black/20">
      <h1 className="mb-4 text-3xl font-semibold text-white">Sign in</h1>
      <p className="mb-6 text-slate-400">Access your tenant dashboard and live match tools.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm text-slate-300">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#111111] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#111111] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
          Login
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
