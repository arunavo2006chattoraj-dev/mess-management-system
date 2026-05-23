import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { User, Lock, Hash, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const Auth = ({ role, onBack }) => {
  const { login, signup } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idValue, setIdValue] = useState(''); // Hostel ID or Emp ID
  
  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password, role, idValue);
      } else {
        await signup(username, password, role, idValue);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const idPlaceholder = role === 'student' ? 'Hostel ID (e.g., H3-B12)' : 'Employee Code (e.g., EMP-902)';
  const idLabel = role === 'student' ? 'Hostel ID & Room No' : 'Official Employee ID';

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <button className="btn btn-secondary" onClick={onBack} style={{ padding: '8px 12px', fontSize: '12px', marginBottom: '20px' }}>
          <ArrowLeft size={14} /> Back to Selection
        </button>

        <div className="auth-header">
          <div className="auth-logo-badge">
            <Sparkles size={24} />
          </div>
          <h1>{role === 'student' ? 'Student Portal' : 'Caterer Kitchen'}</h1>
          <p>{isLogin ? 'Welcome back! Please enter your credentials' : 'Create an account to join the digital mess'}</p>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: '20px' }}>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <div className="input-container">
              <User size={16} className="input-icon" />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="idValue">{idLabel}</label>
            <div className="input-container">
              <Hash size={16} className="input-icon" />
              <input
                id="idValue"
                type="text"
                className="form-control"
                placeholder={idPlaceholder}
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Security Password</label>
            <div className="input-container">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', height: '45px' }} disabled={loading}>
            {loading ? (
              <Loader2 size={18} className="spinner" style={{ border: '2px solid transparent', borderTopColor: 'white', width: '18px', height: '18px' }} />
            ) : (
              isLogin ? 'Sign In Securely' : 'Complete Registration'
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              First time here? <span onClick={() => setIsLogin(false)}>Create an account</span>
            </p>
          ) : (
            <p>
              Already registered? <span onClick={() => setIsLogin(true)}>Sign in here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
