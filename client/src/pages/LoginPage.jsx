import { useState } from 'react';

export function LoginPage({ onLogin, authHook }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { login, register, loading, error } = authHook;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const result = await login(email, password);
      if (result) onLogin(result);
    } else {
      const result = await register(username, email, password);
      if (result) {
        // auto-login after register
        const loginResult = await login(email, password);
        if (loginResult) onLogin(loginResult);
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>WiShuffle</h1>
        <p style={styles.subtitle}>Listen together</p>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'register' && (
            <input
              style={styles.input}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f0f',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '380px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 28px',
    color: '#666',
    textAlign: 'center',
    fontSize: '14px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
  },
  tab: {
    flex: 1,
    padding: '8px',
    border: '1px solid #2e2e2e',
    borderRadius: '6px',
    background: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabActive: {
    background: '#aa3bff22',
    borderColor: '#aa3bff',
    color: '#aa3bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px 14px',
    background: '#111',
    border: '1px solid #2e2e2e',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    margin: '0',
  },
  button: {
    padding: '10px',
    background: '#aa3bff',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
  },
};