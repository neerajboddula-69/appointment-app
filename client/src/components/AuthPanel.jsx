export default function AuthPanel({ loginForm, setLoginForm, authMode, setAuthMode, loading, onSubmit }) {
  const isRegister = authMode === "register";

  function switchRole(role) {
    setLoginForm({
      name: "",
      phone: "",
      role,
      email: role === "admin" && !isRegister ? "admin@example.com" : role === "customer" && !isRegister ? "customer@example.com" : "",
      password: role === "admin" && !isRegister ? "admin123" : role === "customer" && !isRegister ? "customer123" : ""
    });
  }

  return (
    <section className="auth-page">
      <form className="auth-card-lite" onSubmit={onSubmit}>
        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>
        <p>{isRegister ? `Create your ${loginForm.role} account by entering the details below.` : "Please enter your details to sign in."}</p>

        <div className="auth-role-tabs">
          <button
            type="button"
            className={loginForm.role === "customer" ? "active" : ""}
            onClick={() => switchRole("customer")}
          >
            {isRegister ? "Customer Signup" : "Customer Login"}
          </button>
          <button
            type="button"
            className={loginForm.role === "admin" ? "active" : ""}
            onClick={() => switchRole("admin")}
          >
            {isRegister ? "Admin Signup" : "Admin Login"}
          </button>
        </div>

        {isRegister ? (
          <>
            <label>
              Full Name
              <input value={loginForm.name} onChange={(event) => setLoginForm({ ...loginForm, name: event.target.value })} />
            </label>
            <label>
              Mobile Number
              <input value={loginForm.phone} onChange={(event) => setLoginForm({ ...loginForm, phone: event.target.value })} />
            </label>
          </>
        ) : null}

        <label>
          Email Address
          <input value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} />
        </label>

        <label>
          Password
          <input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} />
        </label>

        <button className="auth-submit-button" disabled={loading} type="submit">
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
        </button>

        {loginForm.role === "customer" ? (
          <p className="auth-switch-text">
            {isRegister ? "Already have an account?" : "Need to create an account?"}{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                const nextMode = isRegister ? "login" : "register";
                setAuthMode(nextMode);
                setLoginForm({
                  name: "",
                  phone: "",
                  role: loginForm.role,
                  email: loginForm.role === "admin" && nextMode === "login" ? "admin@example.com" : loginForm.role === "customer" && nextMode === "login" ? "customer@example.com" : "",
                  password: loginForm.role === "admin" && nextMode === "login" ? "admin123" : loginForm.role === "customer" && nextMode === "login" ? "customer123" : ""
                });
              }}
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </p>
        ) : (
          <p className="auth-switch-text">
            {isRegister ? "Already have an admin account?" : "Need an admin account?"}{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                const nextMode = isRegister ? "login" : "register";
                setAuthMode(nextMode);
                setLoginForm({
                  name: "",
                  phone: "",
                  role: "admin",
                  email: nextMode === "login" ? "admin@example.com" : "",
                  password: nextMode === "login" ? "admin123" : ""
                });
              }}
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </p>
        )}
      </form>
    </section>
  );
}
