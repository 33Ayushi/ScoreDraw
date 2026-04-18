'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';
import { mockCharities, mockDraws } from '@/lib/mockData';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [scores, setScores] = useState([]);
  const [charities, setCharities] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [newScoreDate, setNewScoreDate] = useState('');
  const [editingScore, setEditingScore] = useState(null);
  const [editScoreValue, setEditScoreValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fetchingScores, setFetchingScores] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchScores();
      fetchCharities();
    }
  }, [user, authLoading, router]);

  const fetchCharities = async () => {
    const { data, error } = await supabase.from('charities').select('*');
    if (!error) setCharities(data || []);
  };

  const fetchScores = async () => {
    setFetchingScores(true);
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      addToast('Error fetching scores', 'error');
    } else {
      setScores(data || []);
    }
    setFetchingScores(false);
  };

  if (authLoading || !user) {
    return (
      <div className={styles.loading}>
        <div className="skeleton skeleton-title" style={{ width: '200px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '300px' }}></div>
      </div>
    );
  }

  const selectedCharity = charities.find(c => c.id === user.charity_id) || charities[0];

  // Score Management
  const addScore = async () => {
    const scoreNum = parseInt(newScore);
    if (!scoreNum || scoreNum < 1 || scoreNum > 45) {
      addToast('Score must be between 1 and 45 (Stableford)', 'error');
      return;
    }
    if (!newScoreDate) {
      addToast('Please select a date', 'error');
      return;
    }

    const { error } = await supabase
      .from('scores')
      .insert([{ 
        user_id: user.id, 
        score: scoreNum, 
        date: newScoreDate 
      }]);

    if (error) {
      if (error.code === '23505') {
        addToast('Only one score per date is allowed', 'error');
      } else {
        addToast(error.message, 'error');
      }
    } else {
      addToast('Score added successfully! ⛳', 'success');
      setNewScore('');
      setNewScoreDate('');
      fetchScores();
    }
  };

  const deleteScore = async (id) => {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id);

    if (error) {
      addToast('Error deleting score', 'error');
    } else {
      setScores(scores.filter(s => s.id !== id));
      addToast('Score deleted', 'info');
    }
  };

  const [updatingCharity, setUpdatingCharity] = useState(false);

  const updateCharity = async (charityId) => {
    setUpdatingCharity(true);
    const { error } = await supabase
      .from('profiles')
      .update({ charity_id: charityId })
      .eq('id', user.id);

    if (error) {
      addToast('Error updating charity', 'error');
    } else {
      setUser({ ...user, charity_id: charityId });
      addToast('Charity updated successfully! ❤️', 'success');
    }
    setUpdatingCharity(false);
  };

  const startEdit = (score) => {
    setEditingScore(score.id);
    setEditScoreValue(score.score.toString());
  };

  const saveEdit = async (id) => {
    const scoreNum = parseInt(editScoreValue);
    if (!scoreNum || scoreNum < 1 || scoreNum > 45) {
      addToast('Score must be between 1 and 45', 'error');
      return;
    }

    const { error } = await supabase
      .from('scores')
      .update({ score: scoreNum })
      .eq('id', id);

    if (error) {
      addToast('Error updating score', 'error');
    } else {
      setScores(scores.map(s => s.id === id ? { ...s, score: scoreNum } : s));
      setEditingScore(null);
      addToast('Score updated! ✏️', 'success');
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'scores', icon: '⛳', label: 'My Scores' },
    { id: 'draws', icon: '🎲', label: 'Draws' },
    { id: 'charity', icon: '❤️', label: 'Charity' },
    { id: 'winnings', icon: '🏆', label: 'Winnings' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`} id="dashboard-sidebar">
        <div className="sidebar-section">
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{user.name?.charAt(0) || '?'}</div>
            <div>
              <div className={styles.userName}>{user.name || 'Player'}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Dashboard</div>
          {sidebarItems.map(item => (
            <div
              key={item.id}
              className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <div className="sidebar-section" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className={styles.subscriptionCard}>
            <span className={`badge ${user.subscriptions?.[0]?.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
              {user.subscriptions?.[0]?.status || 'No Subscription'}
            </span>
            <div className={styles.subscriptionPlan} style={{ textTransform: 'capitalize' }}>
              {user.subscriptions?.[0]?.plan_type || 'Free'} Plan
            </div>
            {user.subscriptions?.[0]?.end_date && (
              <div className={styles.subscriptionRenew}>
                Renews: {new Date(user.subscriptions[0].end_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰ Menu
      </button>

      {/* Main Content */}
      <div className="dashboard-main" id="dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Welcome back, {user.name?.split(' ')[0] || 'Player'}! 👋</h1>
              <p className="dashboard-subtitle">Here&apos;s your ScoreDraw overview</p>
            </div>

            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-card-icon" style={{ background: 'rgba(245, 166, 35, 0.1)', color: 'var(--primary-400)' }}>⛳</div>
                <div className="stat-card-value">{scores.length}/5</div>
                <div className="stat-card-label">Scores Entered</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon" style={{ background: 'rgba(0, 177, 159, 0.1)', color: 'var(--accent-400)' }}>🎲</div>
                <div className="stat-card-value">0</div>
                <div className="stat-card-label">Draws Entered</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)' }}>🏆</div>
                <div className="stat-card-value">₹0</div>
                <div className="stat-card-label">Total Winnings</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>❤️</div>
                <div className="stat-card-value">{user.charity_percentage || 10}%</div>
                <div className="stat-card-label">Charity Contribution</div>
              </div>
            </div>

            {/* Latest Scores Preview */}
            <div className="grid-2">
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Latest Scores</h3>
                <div className="flex gap-md" style={{ justifyContent: 'center' }}>
                  {scores.slice(0, 5).map((s, i) => (
                    <div key={i} className="number-ball">{s.score}</div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('scores')} className="btn btn-ghost btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                  Manage Scores →
                </button>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Next Draw</h3>
                <div style={{ textAlign: 'center' }}>
                  <div className={styles.drawCountdown}>April 2026</div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Upcoming</span>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Prize Pool: <strong style={{ color: 'var(--primary-400)' }}>₹4,50,000</strong>
                  </div>
                </div>
                <button onClick={() => setActiveTab('draws')} className="btn btn-ghost btn-sm" style={{ marginTop: '1rem', width: '100%' }}>
                  View Draws →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">My Golf Scores ⛳</h1>
              <p className="dashboard-subtitle">Enter and manage your latest 5 Stableford scores (1-45)</p>
            </div>

            {/* Add New Score */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Score</h3>
              <div className="flex gap-md items-center" style={{ flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
                  <label className="form-label">Stableford Score</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="1 - 45"
                    min="1"
                    max="45"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    id="new-score-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: '1 1 200px' }}>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newScoreDate}
                    onChange={(e) => setNewScoreDate(e.target.value)}
                    id="new-score-date"
                  />
                </div>
                <button onClick={addScore} className="btn btn-primary" style={{ alignSelf: 'flex-end' }} id="add-score-btn">
                  + Add Score
                </button>
              </div>
              {scores.length >= 5 && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--warning)' }}>
                  ⚠️ You have 5 scores. Adding a new one will replace the oldest.
                </p>
              )}
            </div>

            {/* Scores List */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Your Scores (Latest 5)</h3>
              <div className="flex gap-lg" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                {scores.map((s, i) => (
                  <div key={i} className="number-ball number-ball-lg">{s.score}</div>
                ))}
              </div>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Score</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((score, i) => (
                      <tr key={score.id}>
                        <td>{i + 1}</td>
                        <td>
                          {editingScore === score.id ? (
                            <input
                              type="number"
                              className="form-input"
                              style={{ width: '80px', padding: '4px 8px' }}
                              min="1"
                              max="45"
                              value={editScoreValue}
                              onChange={(e) => setEditScoreValue(e.target.value)}
                            />
                          ) : (
                            <strong style={{ color: 'var(--primary-400)' }}>{score.score}</strong>
                          )}
                        </td>
                        <td>{new Date(score.date).toLocaleDateString()}</td>
                        <td>
                          {editingScore === score.id ? (
                            <div className="flex gap-sm">
                              <button onClick={() => saveEdit(score.id)} className="btn btn-sm btn-accent">Save</button>
                              <button onClick={() => setEditingScore(null)} className="btn btn-sm btn-ghost">Cancel</button>
                            </div>
                          ) : (
                            <div className="flex gap-sm">
                              <button onClick={() => startEdit(score)} className="btn btn-sm btn-ghost">✏️ Edit</button>
                              <button onClick={() => deleteScore(score.id)} className="btn btn-sm btn-ghost" style={{ color: 'var(--error)' }}>🗑️</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Draws Tab */}
        {activeTab === 'draws' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Draw Participation 🎲</h1>
              <p className="dashboard-subtitle">Your draw entries and results</p>
            </div>

            {/* Upcoming Draw */}
            <div className="card" style={{ marginBottom: '2rem', borderColor: 'rgba(245, 166, 35, 0.3)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h3>Upcoming Draw — April 2026</h3>
                <span className="badge badge-primary">Upcoming</span>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your entry numbers:</p>
                <div className="flex gap-md" style={{ justifyContent: 'center' }}>
                  {scores.map((s, i) => (
                    <div key={i} className="number-ball number-ball-lg">{s.score}</div>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                    Prize Pool: <strong style={{ color: 'var(--primary-400)', fontSize: '1.25rem' }}>₹4,50,000</strong>
                  </span>
                </div>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Past Draws</h3>
            <div className="flex flex-col gap-md">
              <div className="card text-center" style={{ padding: '2rem', color: 'var(--text-tertiary)' }}>
                <p>No past draw participation found.</p>
              </div>
            </div>
          </div>
        )}

        {/* Charity Tab */}
        {activeTab === 'charity' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">My Charity ❤️</h1>
              <p className="dashboard-subtitle">Your charitable contribution details</p>
            </div>

            <div className="grid-2">
              <div className="card card-glow" style={{ borderColor: 'var(--primary-400)' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Supporting Now</h3>
                {selectedCharity && (
                  <>
                    <div className={styles.charityDisplay} style={{ marginBottom: '1rem' }}>
                      <div className={styles.charityIcon}>
                        {selectedCharity.category === 'Youth Development' ? '👶' : 
                         selectedCharity.category === 'Veterans Support' ? '🎖️' : '🤝'}
                      </div>
                      <div>
                        <h4>{selectedCharity.name}</h4>
                        <span className="badge badge-success">Active Choice</span>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {selectedCharity.description}
                    </p>
                    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                        You are donating <strong>{user.charity_percentage || 10}%</strong> of your subscription monthly.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Change Your Impact</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Select another partner to focus your future contributions.
                </p>
                
                <div className="flex flex-col gap-sm">
                  {charities.filter(c => c.id !== user.charity_id).map((charity) => (
                    <div key={charity.id} className={styles.charityOption} style={{ padding: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '0.9375rem' }}>{charity.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{charity.category}</div>
                        </div>
                        <button 
                          onClick={() => updateCharity(charity.id)} 
                          className="btn btn-sm btn-ghost"
                          disabled={updatingCharity}
                          style={{ color: 'var(--primary-400)' }}
                        >
                          {updatingCharity ? '...' : 'Switch →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Winnings Tab */}
        {activeTab === 'winnings' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">My Winnings 🏆</h1>
              <p className="dashboard-subtitle">Your prize history and payment status</p>
            </div>

            <div className="grid-3" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-card-value" style={{ color: 'var(--success)' }}>₹0</div>
                <div className="stat-card-label">Total Won</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value" style={{ color: 'var(--warning)' }}>₹0</div>
                <div className="stat-card-label">Pending Payout</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">₹0</div>
                <div className="stat-card-label">Paid Out</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Winnings History</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Draw</th>
                      <th>Match</th>
                      <th>Prize</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>March 2026</td>
                      <td><span className="badge badge-accent">3 Numbers</span></td>
                      <td><strong style={{ color: 'var(--success)' }}>₹2,500</strong></td>
                      <td><span className="badge badge-warning">Pending</span></td>
                      <td>
                        <button className="btn btn-sm btn-primary" id="upload-proof-btn">
                          📤 Upload Proof
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Settings ⚙️</h1>
              <p className="dashboard-subtitle">Manage your account and preferences</p>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Profile</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" defaultValue={user.name} id="settings-name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" defaultValue={user.email} disabled />
              </div>
              <button className="btn btn-primary" id="save-profile-btn">Save Changes</button>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Subscription</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{user.subscriptions?.[0]?.plan_type || 'No'} Plan</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {user.subscriptions?.[0] ? `₹${user.subscriptions[0].amount}/month — Renews ${new Date(user.subscriptions[0].end_date).toLocaleDateString()}` : 'Not subscribed'}
                  </div>
                </div>
                <span className={`badge ${user.subscriptions?.[0]?.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {user.subscriptions?.[0]?.status || 'Inactive'}
                </span>
              </div>
            </div>

            <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--error)' }}>Danger Zone</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Cancel your subscription or delete your account.
              </p>
              <div className="flex gap-md">
                <button className="btn btn-danger btn-sm">Cancel Subscription</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
