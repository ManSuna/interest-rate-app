// Login.js (no hooks in handlers)
import { useMetadata } from './MetadataProvider';
import { BASE_KEY } from './metadata';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { refetch, clear } = useMetadata();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // ... authenticate, get token/base
    localStorage.setItem('token', token);
    localStorage.setItem(BASE_KEY, backendUrl);
    await refetch();           // optional: warm metadata
    navigate('/home');
  };

  const logout = () => {
    clear();                                  // removes metaData + context state
    localStorage.removeItem('token');
    localStorage.removeItem(BASE_KEY);
    // notify other tabs explicitly (optional)
    localStorage.setItem('logout-ts', Date.now().toString());
    localStorage.removeItem('logout-ts');
    navigate('/login');
  };

  // ...
}




// metadata.js (utility, NO hooks)
export const META_KEY = 'metaData';
export const BASE_KEY = 'backEndBaseURL';

export const readMeta = () => {
  try { const r = localStorage.getItem(META_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
};
export const writeMeta = (data) => localStorage.setItem(META_KEY, JSON.stringify(data));
export const clearMeta = () => localStorage.removeItem(META_KEY);






// Login.js (no hooks in handlers)
import { useMetadata } from './MetadataProvider';
import { BASE_KEY } from './metadata';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { refetch, clear } = useMetadata();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // ... authenticate, get token/base
    localStorage.setItem('token', token);
    localStorage.setItem(BASE_KEY, backendUrl);
    await refetch();           // optional: warm metadata
    navigate('/home');
  };

  const logout = () => {
    clear();                                  // removes metaData + context state
    localStorage.removeItem('token');
    localStorage.removeItem(BASE_KEY);
    // notify other tabs explicitly (optional)
    localStorage.setItem('logout-ts', Date.now().toString());
    localStorage.removeItem('logout-ts');
    navigate('/login');
  };

  // ...
}
