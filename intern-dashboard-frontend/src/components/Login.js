import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Math.floor(Math.random() * 100) + 1,
        name: name.trim(),
        email: email.trim() || `${name.toLowerCase().replace(' ', '.')}@example.com`
      };
      
      onLogin(userData);
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    const demoUsers = [
      { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com' },
      { id: 2, name: 'Bob Jones', email: 'bob.jones@example.com' },
      { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com' }
    ];
    
    const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    onLogin(randomUser);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎯 Intern Dashboard</h1>
          <p>Welcome to your donation tracking platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="demo-section">
          <p>Or try a demo account:</p>
          <button 
            onClick={handleDemoLogin}
            className="login-btn demo"
          >
            🚀 Demo Login
          </button>
        </div>
        
        <div className="login-footer">
          <p>Track your donations • Earn rewards • Compete with peers</p>
        </div>
      </div>
    </div>
  );
};

export default Login;