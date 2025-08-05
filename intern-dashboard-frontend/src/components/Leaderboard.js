import React, { useEffect, useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API connection first
        const testResponse = await fetch(`http://localhost:8000/api/test/`);
        if (!testResponse.ok) {
          throw new Error('Cannot connect to API server. Please make sure Django server is running on http://localhost:8000');
        }
        
        const response = await fetch('http://localhost:8000/api/leaderboard/');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard data: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError(err.message);
        
        // Set fallback data if API fails
        setData(getFallbackLeaderboardData());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getFallbackLeaderboardData = () => {
    const mockData = [
      { name: "Charlie Brown", donations: 3200, referral_code: "charlie2025", rank: 1, badge: "🥇" },
      { name: "Grace Lee", donations: 2750, referral_code: "grace2025", rank: 2, badge: "🥈" },
      { name: "Alice Smith", donations: 2450, referral_code: "alice2025", rank: 3, badge: "🥉" },
      { name: "Eve Wilson", donations: 2100, referral_code: "eve2025", rank: 4, badge: "🏅" },
      { name: "Henry Ford", donations: 1950, referral_code: "henry2025", rank: 5, badge: "🏅" },
      { name: "Diana Prince", donations: 1850, referral_code: "diana2025", rank: 6, badge: "🏅" },
      { name: "Bob Jones", donations: 1700, referral_code: "bob2025", rank: 7, badge: "🏅" },
      { name: "Frank Miller", donations: 1450, referral_code: "frank2025", rank: 8, badge: "🏅" }
    ];

    return {
      leaderboard: mockData,
      total_participants: mockData.length,
      last_updated: new Date().toISOString()
    };
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
          <p>Using demo data for now...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.leaderboard) return null;

  const topThree = data.leaderboard.slice(0, 3);
  const remaining = data.leaderboard.slice(3);

  return (
    <div className="leaderboard-container">
      {error && (
        <div className="error-notification">
          <span>⚠️ Using demo data - API connection failed</span>
        </div>
      )}
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top performers in our donation drive</p>
        <div className="stats-summary">
          <div className="summary-item">
            <span className="number">{data.total_participants}</span>
            <span className="label">Total Participants</span>
          </div>
          <div className="summary-item">
            <span className="number">₹{data.leaderboard.reduce((sum, user) => sum + user.donations, 0).toLocaleString()}</span>
            <span className="label">Total Raised</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium-section">
        <h2>🥇 Top Performers</h2>
        <div className="podium">
          {topThree.map((user, index) => (
            <div key={user.referral_code || index} className={`podium-place place-${index + 1}`}>
              <div className="podium-rank">{user.badge}</div>
              <div className="podium-user">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3>{user.name}</h3>
                <p className="donation-amount">₹{user.donations.toLocaleString()}</p>
                <div className="referral-code">{user.referral_code}</div>
              </div>
              <div className={`podium-base base-${index + 1}`}>
                <span className="rank-number">#{user.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remaining Rankings */}
      {remaining.length > 0 && (
        <div className="rankings-section">
          <h2>📊 All Rankings</h2>
          <div className="rankings-list">
            {remaining.map((user, index) => (
              <div key={user.referral_code || index} className="ranking-item">
                <div className="rank-badge">
                  <span className="rank-number">#{user.rank}</span>
                  <span className="rank-badge-icon">{user.badge}</span>
                </div>
                
                <div className="user-info">
                  <div className="user-avatar small">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <span className="user-code">{user.referral_code}</span>
                  </div>
                </div>
                
                <div className="donation-info">
                  <span className="amount">₹{user.donations.toLocaleString()}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${(user.donations / data.leaderboard[0].donations) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Levels */}
      <div className="achievement-levels">
        <h2>🎯 Achievement Levels</h2>
        <div className="levels-grid">
          <div className="level-card">
            <div className="level-icon">🥇</div>
            <h4>Legend</h4>
            <p>₹5,000+</p>
          </div>
          <div className="level-card">
            <div className="level-icon">🏆</div>
            <h4>Champion</h4>
            <p>₹2,500+</p>
          </div>
          <div className="level-card">
            <div className="level-icon">⭐</div>
            <h4>Rising Star</h4>
            <p>₹1,000+</p>
          </div>
          <div className="level-card">
            <div className="level-icon">🎯</div>
            <h4>Starter</h4>
            <p>₹100+</p>
          </div>
        </div>
      </div>

      <div className="leaderboard-footer">
        <p>Last updated: {new Date(data.last_updated).toLocaleString()}</p>
        <p>Keep up the great work! 🚀</p>
      </div>
    </div>
  );
};

export default Leaderboard;