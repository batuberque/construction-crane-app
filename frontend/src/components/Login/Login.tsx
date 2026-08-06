import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Page from '../../lib/ui/Page';
import { useLoginUser } from '../../services/queries';

const inputClass =
  'w-full border border-steel-line bg-steel px-3.5 py-3 text-signal focus:border-hazard transition-colors';

const Login = () => {
  const navigate = useNavigate();
  // Local state — username and password used to sit in a global zustand store,
  // readable by any mounted component and never cleared.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isLoading, isError } = useLoginUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('token', data.accessToken);
          // ponytail: the role gate is cosmetic — /auth/login returns only a
          // token and the API does not enforce it either (backend/lib/auth.js
          // exports authenticateToken but no route applies it). Keeping the
          // literal preserves current behaviour; real enforcement belongs
          // server-side.
          localStorage.setItem('role', 'editor');
          navigate('/admin', { replace: true });
        },
      }
    );
  };

  return (
    <Page>
      <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20 sm:px-6">
        <h1 className="text-display-m font-bold uppercase">Yönetici girişi</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="spec mb-2 block">
              Kullanıcı adı
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="spec mb-2 block">
              Parola
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-hazard px-6 py-4 spec font-medium text-graphite hover:bg-hazard/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Giriş yapılıyor…' : 'Giriş yapın'}
          </button>

          <div aria-live="polite">
            {isError && (
              <p role="alert" className="border-l-2 border-red-500 bg-steel p-4">
                Kullanıcı adı veya parola hatalı.
              </p>
            )}
          </div>
        </form>
      </div>
    </Page>
  );
};

export default Login;
