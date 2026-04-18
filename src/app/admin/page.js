'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/Toast';
import { mockUsers, mockCharities, mockDraws, mockAdminStats } from '@/lib/mockData';
import styles from './admin.module.css';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawType, setDrawType] = useState('random');
  const [simResult, setSimResult] = useState(null);
  const [charities, setCharities] = useState(mockCharities);
  const [showAddCharity, setShowAddCharity] = useState(false);
  const [newCharity, setNewCharity] = useState({ name: '', description: '', category: '', website: '' });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton skeleton-title" style={{ width: '200px' }}></div>
      </div>
    );
  }

  const stats = mockAdminStats;

  // Draw simulation
  const runSimulation = () => {
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    numbers.sort((a, b) => a - b);

    // Simulate winners
    const simWinners = {
      five_match: Math.random() < 0.05 ? 1 : 0,
      four_match: Math.floor(Math.random() * 3),
      three_match: Math.floor(Math.random() * 8) + 1,
    };

    setSimResult({
      numbers,
      winners: simWinners,
      pool: {
        total: stats.totalPrizePool,
        five: Math.round(stats.totalPrizePool * 0.4),
        four: Math.round(stats.totalPrizePool * 0.35),
        three: Math.round(stats.totalPrizePool * 0.25),
      }
    });
    addToast('Simulation completed!', 'success');
  };

  const publishDraw = () => {
    if (!simResult) {
      addToast('Run a simulation first', 'warning');
      return;
    }
    addToast('Draw results published! 🎉', 'success');
  };

  const addCharity = () => {
    if (!newCharity.name || !newCharity.description || !newCharity.category) {
      addToast('Please fill in all required fields', 'error');
      return;
    }
    const charity = {
      id: String(charities.length + 1),
      ...newCharity,
      image_url: '',
      featured: false,
      total_raised: 0,
      events: [],
    };
    setCharities([...charities, charity]);
    setNewCharity({ name: '', description: '', category: '', website: '' });
    setShowAddCharity(false);
    addToast('Charity added successfully! ❤️', 'success');
  };

  const deleteCharity = (id) => {
    setCharities(charities.filter(c => c.id !== id));
    addToast('Charity removed', 'info');
  };

  const sidebarItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'draws', icon: '🎲', label: 'Draw Management' },
    { id: 'charities', icon: '❤️', label: 'Charities' },
    { id: 'winners', icon: '🏆', label: 'Winners' },
    { id: 'reports', icon: '📈', label: 'Reports' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`} id="admin-sidebar">
        <div className="sidebar-section">
          <div className={styles.adminBadge}>
            <span>⚙️</span>
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Management</div>
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
      </aside>

      <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰ Admin Menu
      </button>

      {/* Main Content */}
      <div className="dashboard-main" id="admin-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Admin Dashboard 📊</h1>
              <p className="dashboard-subtitle">Platform overview and key metrics</p>
            </div>

            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              {[
                { icon: '👥', value: stats.totalUsers, label: 'Total Users', color: 'var(--info)' },
                { icon: '✅', value: stats.activeSubscribers, label: 'Active Subscribers', color: 'var(--success)' },
                { icon: '💰', value: `₹${stats.totalPrizePool.toLocaleString()}`, label: 'Total Prize Pool', color: 'var(--primary-400)' },
                { icon: '❤️', value: `₹${stats.totalCharityContributions.toLocaleString()}`, label: 'Charity Contributions', color: 'var(--error)' },
              ].map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                  <div className="stat-card-value">{stat.value}</div>
                  <div className="stat-card-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid-3" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-card-value" style={{ color: 'var(--primary-400)' }}>₹{stats.monthlyRevenue.toLocaleString()}</div>
                <div className="stat-card-label">Monthly Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">{stats.averageScore}</div>
                <div className="stat-card-label">Average Stableford Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value" style={{ color: 'var(--warning)' }}>₹{stats.jackpotAmount.toLocaleString()}</div>
                <div className="stat-card-label">Current Jackpot</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
                <div className="flex flex-col gap-sm">
                  <button className="btn btn-primary w-full" onClick={() => setActiveTab('draws')}>🎲 Manage Draws</button>
                  <button className="btn btn-accent w-full" onClick={() => setActiveTab('winners')}>🏆 Verify Winners</button>
                  <button className="btn btn-secondary w-full" onClick={() => setActiveTab('charities')}>❤️ Manage Charities</button>
                </div>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>System Status</h3>
                <div className="flex flex-col gap-md">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Verifications</span>
                    <span className="badge badge-warning">{stats.pendingVerifications}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Draws Completed</span>
                    <span className="badge badge-success">{stats.drawsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Active Charities</span>
                    <span className="badge badge-accent">{charities.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>System Health</span>
                    <span className="badge badge-success">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">User Management 👥</h1>
              <p className="dashboard-subtitle">View and manage all platform users</p>
            </div>

            <div className="card">
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h3>All Users ({stats.totalUsers})</h3>
                <input type="text" className="form-input" placeholder="🔍 Search users..." style={{ width: '250px' }} id="search-users" />
              </div>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Scores</th>
                      <th>Charity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Alex Thompson', email: 'alex@email.com', plan: 'Monthly', status: 'Active', scores: 5, charity: 'Children\'s Golf' },
                      { name: 'Sarah Connor', email: 'sarah@email.com', plan: 'Yearly', status: 'Active', scores: 5, charity: 'Veterans' },
                      { name: 'John Smith', email: 'john@email.com', plan: 'Monthly', status: 'Active', scores: 4, charity: 'Green Earth' },
                      { name: 'Maria Garcia', email: 'maria@email.com', plan: 'Monthly', status: 'Lapsed', scores: 5, charity: 'Disability Golf' },
                      { name: 'James Wilson', email: 'james@email.com', plan: 'Yearly', status: 'Active', scores: 3, charity: 'Mental Health' },
                      { name: 'Emily Brown', email: 'emily@email.com', plan: 'Monthly', status: 'Active', scores: 5, charity: 'Community Links' },
                    ].map((u, i) => (
                      <tr key={i}>
                        <td><strong>{u.name}</strong></td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                        <td><span className="badge badge-info">{u.plan}</span></td>
                        <td>
                          <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>{u.scores}/5</td>
                        <td style={{ fontSize: '0.8125rem' }}>{u.charity}</td>
                        <td>
                          <div className="flex gap-sm">
                            <button className="btn btn-sm btn-ghost">✏️</button>
                            <button className="btn btn-sm btn-ghost">👁️</button>
                          </div>
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
              <h1 className="dashboard-title">Draw Management 🎲</h1>
              <p className="dashboard-subtitle">Configure, simulate, and publish monthly draws</p>
            </div>

            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              {/* Draw Configuration */}
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Draw Configuration</h3>
                <div className="form-group">
                  <label className="form-label">Draw Type</label>
                  <select
                    className="form-select"
                    value={drawType}
                    onChange={(e) => setDrawType(e.target.value)}
                    id="draw-type-select"
                  >
                    <option value="random">Random — Standard Lottery</option>
                    <option value="algorithmic">Algorithmic — Weighted by Frequency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Draw Month</label>
                  <select className="form-select" id="draw-month-select">
                    <option>April 2026</option>
                    <option>May 2026</option>
                  </select>
                </div>
                <div className="flex gap-md">
                  <button className="btn btn-primary" onClick={runSimulation} id="run-simulation-btn">
                    🔄 Run Simulation
                  </button>
                  <button className="btn btn-accent" onClick={publishDraw} id="publish-draw-btn">
                    📢 Publish Results
                  </button>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>
                  {simResult ? 'Simulation Result' : 'No Simulation Yet'}
                </h3>
                {simResult ? (
                  <>
                    <div className="flex gap-md" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                      {simResult.numbers.map((num, i) => (
                        <div key={i} className="number-ball number-ball-lg">{num}</div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-sm">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-secondary)' }}>5-Match Winners:</span>
                        <strong>{simResult.winners.five_match}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-secondary)' }}>4-Match Winners:</span>
                        <strong>{simResult.winners.four_match}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--text-secondary)' }}>3-Match Winners:</span>
                        <strong>{simResult.winners.three_match}</strong>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>5-Match Pool:</span>
                          <strong style={{ color: 'var(--primary-400)' }}>₹{simResult.pool.five.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>4-Match Pool:</span>
                          <strong>₹{simResult.pool.four.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>3-Match Pool:</span>
                          <strong>₹{simResult.pool.three.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎲</p>
                    <p>Run a simulation to see results</p>
                  </div>
                )}
              </div>
            </div>

            {/* Draw History */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Draw History</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Type</th>
                      <th>Numbers</th>
                      <th>Entries</th>
                      <th>Pool</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDraws.map((draw, i) => (
                      <tr key={i}>
                        <td><strong>{draw.month} {draw.year}</strong></td>
                        <td><span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{draw.type}</span></td>
                        <td>
                          {draw.winning_numbers ? (
                            <div className="flex gap-sm">
                              {draw.winning_numbers.map((n, j) => (
                                <span key={j} style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: '700' }}>{n}</span>
                              ))}
                            </div>
                          ) : '—'}
                        </td>
                        <td>{draw.entries_count}</td>
                        <td>₹{draw.prize_pool.total.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${draw.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                            {draw.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Charities Tab */}
        {activeTab === 'charities' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="dashboard-title">Charity Management ❤️</h1>
                  <p className="dashboard-subtitle">Add, edit, and manage charity listings</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddCharity(true)} id="add-charity-btn">
                  + Add Charity
                </button>
              </div>
            </div>

            {/* Add Charity Modal */}
            {showAddCharity && (
              <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddCharity(false)}>
                <div className="modal">
                  <div className="modal-header">
                    <h3 className="modal-title">Add New Charity</h3>
                    <button className="modal-close" onClick={() => setShowAddCharity(false)}>✕</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">Charity Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Charity name"
                        value={newCharity.name}
                        onChange={(e) => setNewCharity({ ...newCharity, name: e.target.value })}
                        id="charity-name-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={newCharity.category}
                        onChange={(e) => setNewCharity({ ...newCharity, category: e.target.value })}
                        id="charity-category-select"
                      >
                        <option value="">Select category</option>
                        <option value="Youth Development">Youth Development</option>
                        <option value="Veterans Support">Veterans Support</option>
                        <option value="Environment">Environment</option>
                        <option value="Accessibility">Accessibility</option>
                        <option value="Mental Health">Mental Health</option>
                        <option value="Community">Community</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-input"
                        rows="3"
                        placeholder="Describe the charity..."
                        value={newCharity.description}
                        onChange={(e) => setNewCharity({ ...newCharity, description: e.target.value })}
                        style={{ resize: 'vertical' }}
                        id="charity-description-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://..."
                        value={newCharity.website}
                        onChange={(e) => setNewCharity({ ...newCharity, website: e.target.value })}
                        id="charity-website-input"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={() => setShowAddCharity(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={addCharity} id="save-charity-btn">Add Charity</button>
                  </div>
                </div>
              </div>
            )}

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Charity</th>
                    <th>Category</th>
                    <th>Total Raised</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {charities.map((charity, i) => (
                    <tr key={charity.id}>
                      <td>
                        <div>
                          <strong>{charity.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{charity.description?.substring(0, 60)}...</div>
                        </div>
                      </td>
                      <td><span className="badge badge-accent">{charity.category}</span></td>
                      <td>₹{charity.total_raised?.toLocaleString() || 0}</td>
                      <td>
                        <span className={`badge ${charity.featured ? 'badge-success' : 'badge-info'}`}>
                          {charity.featured ? 'Featured' : 'Standard'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-sm">
                          <button className="btn btn-sm btn-ghost">✏️</button>
                          <button
                            className="btn btn-sm btn-ghost"
                            style={{ color: 'var(--error)' }}
                            onClick={() => deleteCharity(charity.id)}
                          >🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Winners Tab */}
        {activeTab === 'winners' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Winner Verification 🏆</h1>
              <p className="dashboard-subtitle">Review and verify winning submissions</p>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Draw</th>
                    <th>Match</th>
                    <th>Prize</th>
                    <th>Proof</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Sarah Connor', draw: 'March 2026', match: 4, prize: 833, proof: true, status: 'pending' },
                    { name: 'Alex Thompson', draw: 'March 2026', match: 3, prize: 297.50, proof: true, status: 'pending' },
                    { name: 'John Smith', draw: 'March 2026', match: 3, prize: 297.50, proof: false, status: 'awaiting_proof' },
                    { name: 'Emily Brown', draw: 'Feb 2026', match: 4, prize: 770, proof: true, status: 'approved' },
                    { name: 'David Lee', draw: 'Feb 2026', match: 4, prize: 770, proof: true, status: 'paid' },
                    { name: 'Tom Hardy', draw: 'Feb 2026', match: 3, prize: 366.67, proof: true, status: 'paid' },
                  ].map((w, i) => (
                    <tr key={i}>
                      <td><strong>{w.name}</strong></td>
                      <td>{w.draw}</td>
                      <td><span className={`badge ${w.match === 4 ? 'badge-primary' : 'badge-accent'}`}>{w.match}-Match</span></td>
                      <td><strong style={{ color: 'var(--success)' }}>₹{w.prize.toFixed(0)}</strong></td>
                      <td>
                        {w.proof ? (
                          <span className="badge badge-success">Uploaded</span>
                        ) : (
                          <span className="badge badge-warning">Missing</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          w.status === 'paid' ? 'badge-success' :
                          w.status === 'approved' ? 'badge-info' :
                          w.status === 'pending' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {w.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        {w.status === 'pending' && (
                          <div className="flex gap-sm">
                            <button className="btn btn-sm btn-accent" onClick={() => addToast(`${w.name} approved!`, 'success')}>✓ Approve</button>
                            <button className="btn btn-sm btn-ghost" style={{ color: 'var(--error)' }}>✕ Reject</button>
                          </div>
                        )}
                        {w.status === 'approved' && (
                          <button className="btn btn-sm btn-primary" onClick={() => addToast(`Payment sent to ${w.name}`, 'success')}>💰 Mark Paid</button>
                        )}
                        {w.status === 'paid' && (
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="animate-fade-in">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Reports & Analytics 📈</h1>
              <p className="dashboard-subtitle">Platform performance and insights</p>
            </div>

            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-card-value">{stats.totalUsers}</div>
                <div className="stat-card-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">₹{stats.totalPrizePool.toLocaleString()}</div>
                <div className="stat-card-label">Total Prize Pool</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">₹{stats.totalCharityContributions.toLocaleString()}</div>
                <div className="stat-card-label">Charity Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-value">{stats.drawsCompleted}</div>
                <div className="stat-card-label">Draws Completed</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Revenue Breakdown</h3>
                <div className="flex flex-col gap-md">
                  <div>
                    <div className="flex justify-between mb-md">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subscriptions</span>
                      <span style={{ fontWeight: '600' }}>₹{stats.monthlyRevenue.toLocaleString()}/mo</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-md">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Prize Pool Allocation</span>
                      <span style={{ fontWeight: '600' }}>60%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '60%', background: 'var(--gradient-accent)' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-md">
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Charity Contributions</span>
                      <span style={{ fontWeight: '600' }}>~15% avg</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: '15%', background: 'var(--error)' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Draw Statistics</h3>
                <div className="flex flex-col gap-md">
                  {mockDraws.filter(d => d.status === 'published').map((draw, i) => (
                    <div key={i} className="flex justify-between items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9375rem' }}>{draw.month} {draw.year}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{draw.entries_count} entries</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: 'var(--primary-400)' }}>₹{draw.prize_pool.total.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {(draw.winners?.four_match?.length || 0) + (draw.winners?.three_match?.length || 0)} winners
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
