'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/Toast';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const { user, error } = await signIn(email, password);
      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Welcome back! 🎉', 'success');
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      addToast('Something went wrong', 'error');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formSide}>
          <div className={styles.formWrapper}>
            <div className={styles.header}>
              <h1 className={styles.title}>Welcome Back</h1>
              <p className={styles.subtitle}>Sign in to your ScoreDraw account</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="login-email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="login-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={loading}
                id="login-submit"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className={styles.divider}>
              <span>Demo Credentials</span>
            </div>

            <div className={styles.demoCredentials}>
              <div className={styles.demoCard} onClick={() => { setEmail('demo@scoredraw.in'); setPassword('demo123'); }}>
                <span className={styles.demoIcon}>👤</span>
                <div>
                  <div className={styles.demoRole}>Subscriber</div>
                  <div className={styles.demoEmail}>demo@scoredraw.in</div>
                </div>
              </div>
              <div className={styles.demoCard} onClick={() => { setEmail('admin@scoredraw.in'); setPassword('admin123'); }}>
                <span className={styles.demoIcon}>⚙️</span>
                <div>
                  <div className={styles.demoRole}>Administrator</div>
                  <div className={styles.demoEmail}>admin@scoredraw.in</div>
                </div>
              </div>
            </div>

            <p className={styles.footerText}>
              Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
            </p>
          </div>
        </div>

        <div className={styles.brandSide}>
          <div className={styles.brandContent}>
            <div className={styles.brandIcon}>⚡</div>
            <h2 className={styles.brandTitle}>ScoreDraw</h2>
            <p className={styles.brandDesc}>
              Play golf. Win prizes. Support incredible charities. Your scores could change lives.
            </p>
            <div className={styles.brandStats}>
              <div className={styles.brandStat}>
                <div className={styles.brandStatValue}>₹3,30,000</div>
                <div className={styles.brandStatLabel}>Jackpot</div>
              </div>
              <div className={styles.brandStat}>
                <div className={styles.brandStatValue}>312+</div>
                <div className={styles.brandStatLabel}>Players</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
