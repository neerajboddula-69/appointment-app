const customerDemo = {
  role: "customer",
  email: "customer@example.com",
  password: "customer123"
};

const adminDemo = {
  role: "admin",
  email: "admin@example.com",
  password: "admin123"
};

export default function LoginCard({ session, loginForm, setLoginForm, authMode, setAuthMode, loading, onLogin, onRegister, onSignOut }) {
  if (session) {
    return (
      <div className="profile-card">
        <p className="eyebrow">Welcome back</p>
        <h2>{session.user.name}</h2>
        <p>{session.user.title}</p>
        <button className="ghost-button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={authMode === "register" ? onRegister : onLogin} className="login-card">
      <div className="auth-card-head">
        <p className="eyebrow">Access portal</p>
        <h3>{authMode === "register" && loginForm.role === "customer" ? "Create your customer account" : "Sign in to continue"}</h3>
        <p className="helper-text">
          Switch between customer and provider access, then continue with booking, scheduling, and availability controls.
        </p>
      </div>
      <div className="role-toggle">
        <button
          type="button"
          className={loginForm.role === "customer" ? "active" : ""}
          onClick={() => {
            setAuthMode("login");
            setLoginForm({ ...customerDemo, name: "" });
          }}
        >
          Customer
        </button>
        <button
          type="button"
          className={loginForm.role === "admin" ? "active" : ""}
          onClick={() => {
            setAuthMode("login");
            setLoginForm(adminDemo);
          }}
        >
          Admin
        </button>
      </div>

      <div className="auth-fields">
        {authMode === "register" && loginForm.role === "customer" ? (
          <label>
            Full name
            <input value={loginForm.name || ""} onChange={(event) => setLoginForm({ ...loginForm, name: event.target.value })} />
          </label>
        ) : null}
        {authMode === "register" && loginForm.role === "customer" ? (
          <label>
            Mobile number
            <input value={loginForm.phone || ""} onChange={(event) => setLoginForm({ ...loginForm, phone: event.target.value })} />
          </label>
        ) : null}
        <label>
          Email
          <input value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} />
        </label>
      </div>

      <button className="primary-button auth-submit" disabled={loading} type="submit">
        {loading ? "Please wait..." : authMode === "register" && loginForm.role === "customer" ? "Create customer account" : "Enter dashboard"}
      </button>

      {loginForm.role === "customer" ? (
        <div className="auth-bottom">
          <p className="helper-text auth-bottom-text">{authMode === "login" ? "New here? Create an account first." : "Already registered? Sign in here."}</p>
          <div className="auth-mode-toggle">
            <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
              Sign in
            </button>
            <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
              Create account
            </button>
          </div>
        </div>
      ) : null}

      <p className="helper-text auth-demo">
        Demo customer: customer@example.com / customer123 | Demo admin: admin@example.com / admin123
      </p>
    </form>
  );
}
