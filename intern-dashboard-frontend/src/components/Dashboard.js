import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ internId }) => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test API connection first
        const testResponse = await fetch(`http://localhost:8000/api/test/`);
        if (!testResponse.ok) {
          throw new Error('Cannot connect to API server. Please make sure Django server is running on http://localhost:8000');
        }
        
        // Fetch dashboard data
        const dashboardResponse = await fetch(`http://localhost:8000/api/intern/${internId}/dashboard/`);
        if (!dashboardResponse.ok) {
          throw new Error(`Failed to fetch dashboard data: ${dashboardResponse.status}`);
        }
        const dashboardData = await dashboardResponse.json();
        setData(dashboardData);

        // Fetch stats data
        const statsResponse = await fetch(`http://localhost:8000/api/intern/${internId}/stats/`);
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats data: ${statsResponse.status}`);
        }
        const statsData = await statsResponse.json();
        setStats(statsData);

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
        
        // Set fallback data if API fails
        setData(getFallbackDashboardData(internId));
        setStats(getFallbackStatsData());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [internId]);

  const getFallbackDashboardData = (id) => {
    const names = ["Alice Smith", "Bob Jones", "Charlie Brown", "Diana Prince", "Eve Wilson"];
    const name = names[id % names.length];
    const totalDonations = 2450;
    
    return {
      id: id,
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      referral_code: `${name.split()[0].toLowerCase()}${Math.floor(Math.random() * 9999)}`,
      total_donations: totalDonations,
      rewards: [
        {
          id: 1,
          title: "First Donation",
          description: "Complete your first donation",
          required_donations: 100,
          icon: "🎯",
          unlocked: true
        },
        {
          id: 2,
          title: "Rising Star",
          description: "Reach ₹1000 in donations",
          required_donations: 1000,
          icon: "⭐",
          unlocked: true
        },
        {
          id: 3,
          title: "Champion",
          description: "Reach ₹2500 in donations",
          required_donations: 2500,
          icon: "🏆",
          unlocked: false
        }
      ],
      recent_donations: [
        { amount: 500, donor_name: "John Doe", date: "2024-01-15 14:30" },
        { amount: 250, donor_name: "Jane Smith", date: "2024-01-14 10:15" },
        { amount: 750, donor_name: "Anonymous", date: "2024-01-13 16:45" }
      ],
      progress: {
        current_level: "Rising Star",
        next_milestone: 2500,
        progress_percentage: 65
      }
    };
  };

  const getFallbackStatsData = () => {
    return {
      total_donations: 2450,
      total_donors: 25,
      average_donation: 350,
      this_month: {
        donations: 800,
        donors: 8,
        growth: 15
      },
      donation_trend: [
        { month: "Jan", amount: 400 },
        { month: "Feb", amount: 600 },
        { month: "Mar", amount: 350 },
        { month: "Apr", amount: 800 },
        { month: "May", amount: 550 },
        { month: "Jun", amount: 750 }
      ]
    };
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>⚠️ Connection Error</h3>
          <p>{error}</p>
          <p>Using demo data for now...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="dashboard-container">
      {error && (
        <div className="error-notification">
          <span>⚠️ Using demo data - API connection failed</span>
        </div>
      )}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {data.name}! 👋</h1>
          <p>Here's your donation tracking overview</p>
        </div>
        <div className="referral-code">
          <span className="label">Your Referral Code:</span>
          <span className="code">{data.referral_code}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{data.total_donations.toLocaleString()}</h3>
            <p>Total Donations</p>
          </div>
        </div>
        
        {stats && (
          <>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.total_donors}</h3>
                <p>Total Donors</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>₹{stats.average_donation}</h3>
                <p>Average Donation</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>₹{stats.this_month.donations}</h3>
                <p>This Month</p>
                <span className={`growth ${stats.this_month.growth >= 0 ? 'positive' : 'negative'}`}>
                  {stats.this_month.growth >= 0 ? '↗️' : '↘️'} {Math.abs(stats.this_month.growth)}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <div className="progress-section">
            <h2>🎯 Progress to Next Level</h2>
            <div className="progress-card">
              <div className="level-info">
                <span className="current-level">{data.progress.current_level}</span>
                <span className="next-milestone">Next: ₹{data.progress.next_milestone.toLocaleString()}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(data.progress.progress_percentage, 100)}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {Math.round(data.progress.progress_percentage)}% Complete
              </div>
            </div>
          </div>

          <div className="rewards-section">
            <h2>🏆 Rewards & Achievements</h2>
            <div className="rewards-grid">
              {data.rewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className={`reward-card ${reward.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="reward-icon">{reward.icon}</div>
                  <div className="reward-content">
                    <h4>{reward.title}</h4>
                    <p>{reward.description}</p>
                    <div className="reward-requirement">
                      ₹{reward.required_donations.toLocaleString()} required
                    </div>
                  </div>
                  {reward.unlocked && <div className="unlock-badge">✅</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="recent-donations">
            <h2>💸 Recent Donations</h2>
            <div className="donations-list">
              {data.recent_donations.length > 0 ? (
                data.recent_donations.map((donation, index) => (
                  <div key={index} className="donation-item">
                    <div className="donation-amount">₹{donation.amount}</div>
                    <div className="donation-details">
                      <div className="donor-name">{donation.donor_name}</div>
                      <div className="donation-date">{donation.date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-donations">
                  <p>No recent donations</p>
                  <span>Share your referral code to get started!</span>
                </div>
              )}
            </div>
          </div>

          {stats && stats.donation_trend && (
            <div className="trend-section">
              <h2>📊 Monthly Trend</h2>
              <div className="trend-chart">
                {stats.donation_trend.map((month, index) => (
                  <div key={index} className="trend-bar">
                    <div 
                      className="bar" 
                      style={{ 
                        height: `${(month.amount / Math.max(...stats.donation_trend.map(m => m.amount))) * 100}%` 
                      }}
                    ></div>
                    <div className="month-label">{month.month}</div>
                    <div className="amount-label">₹{month.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;