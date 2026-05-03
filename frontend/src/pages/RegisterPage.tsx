import { useState } from "react";
import { registerUser } from "../api/auth";

const RegisterPage = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    try {
      await registerUser({
        username,
        password,
        organization_name: organizationName,
        organization_slug: organizationSlug,
      });
      setMessage("Registration successful. You are now signed in.");
    } catch (err) {
      setMessage("Registration failed. Please check your data and try again.");
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-[#181818] p-8 shadow-lg shadow-black/20">
      <h1 className="mb-4 text-3xl font-semibold text-white">Create an account</h1>
      <p className="mb-6 text-slate-400">Register your organization and get access to the SuperSports admin experience.</p>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm text-slate-300">Organization name</span>
          <input
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#111111] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Organization slug</span>
          <input
            value={organizationSlug}
            onChange={(e) => setOrganizationSlug(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-700 bg-[#111111] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </label>
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
        {message ? <p className="text-sm text-cyan-300">{message}</p> : null}
        <button className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
          Register
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;
