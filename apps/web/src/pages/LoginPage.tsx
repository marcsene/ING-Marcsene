import "./LoginPage.css";
import { useState } from "react";
import type { FormEvent } from "react";
import logo from "../assets/brand/ing-marcsene-logo.png";
import { login } from "../services/api/authApi";

interface LoginPageProps {
  onLogin: (accessToken: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(username, password);

      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      onLogin(response.access);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible iniciar sesión.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <img
            src={logo}
            alt="ING.Marcsene"
            className="login-logo"
          />

          <h1>Bienvenido</h1>
          <p>Ingresa a tu cuenta de ING.Marcsene</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Usuario</label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </main>
  );
}