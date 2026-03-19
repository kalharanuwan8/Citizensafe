import LoginForm from '../components/auth/LoginForm';

// ── LoginPage ─────────────────────────────────────────────────────────────────
// LoginForm is self-contained (renders its own card + full-screen bg).
// This page is a semantic shell so the route has a dedicated file.

const LoginPage = () => <LoginForm />;

export default LoginPage;