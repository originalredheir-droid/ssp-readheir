import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, loginWithGoogle, loading } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    try {
      await register({
        username: email,
        password,
        email,
        organization_name: organizationName,
        organization_slug: organizationSlug,
      });
      navigate("/dashboard");
    } catch (err) {
      setMessage("Registration failed. Please check your data and try again.");
    }
  }

  async function handleGoogleRegister() {
    setMessage(null);
    try {
      await loginWithGoogle();
      // After Google login, might need to handle organization setup
      navigate("/dashboard");
    } catch (err) {
      setMessage("Google registration failed.");
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-[#181818] p-8 shadow-lg shadow-black/20">
      <h1 className="mb-4 text-3xl font-semibold text-white">Registration disabled</h1>
      <p className="mb-6 text-slate-400">
        Signup is temporarily disabled so you can inspect the app pages without authentication.
      </p>
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
        Use the top navigation to explore the app pages and preview the UI.
      </div>
    </section>
  );
};

export default RegisterPage;
