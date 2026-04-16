import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPanel from "../components/AuthPanel";
import { useApp } from "../services/appContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authMode, setAuthMode, loginForm, setLoginForm, loading, login, register } = useApp();

  useEffect(() => {
    const mode = searchParams.get("mode");

    if (mode !== "register") {
      return;
    }

    setAuthMode("register");
    setLoginForm((current) => ({
      ...current,
      name: "",
      phone: "",
      role: "customer",
      email: "",
      password: ""
    }));
  }, [searchParams, setAuthMode, setLoginForm]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (authMode === "register") {
        await register();
      } else {
        await login();
      }
      navigate("/dashboard");
    } catch {}
  }

  return (
    <AuthPanel
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      authMode={authMode}
      setAuthMode={setAuthMode}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}
