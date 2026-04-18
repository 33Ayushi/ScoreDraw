'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          ScoreDraw
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link href="/" className="navbar-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/how-it-works" className="navbar-link" onClick={() => setMobileOpen(false)}>How It Works</Link>
          <Link href="/charities" className="navbar-link" onClick={() => setMobileOpen(false)}>Charities</Link>
          <Link href="/draws" className="navbar-link" onClick={() => setMobileOpen(false)}>Draws</Link>
          <Link href="/pricing" className="navbar-link" onClick={() => setMobileOpen(false)}>Pricing</Link>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-secondary btn-sm">
                {user.role === 'admin' ? '⚙️ Admin' : '📊 Dashboard'}
              </Link>
              <button onClick={signOut} className="btn btn-ghost btn-sm">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm" id="login-btn">
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm" id="signup-btn">
                Get Started
              </Link>
            </>
          )}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            id="hamburger-btn"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
