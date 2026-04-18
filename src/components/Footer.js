'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">⚡ ScoreDraw</div>
            <p className="footer-desc">
              Where your passion for golf meets purpose. Play, win, and make a 
              difference — one score at a time.
            </p>
          </div>
          <div>
            <h4 className="footer-heading">Platform</h4>
            <Link href="/how-it-works" className="footer-link">How It Works</Link>
            <Link href="/draws" className="footer-link">Monthly Draws</Link>
            <Link href="/pricing" className="footer-link">Pricing</Link>
            <Link href="/charities" className="footer-link">Charities</Link>
          </div>
          <div>
            <h4 className="footer-heading">Account</h4>
            <Link href="/login" className="footer-link">Sign In</Link>
            <Link href="/signup" className="footer-link">Get Started</Link>
            <Link href="/dashboard" className="footer-link">Dashboard</Link>
          </div>
          <div>
            <h4 className="footer-heading">Legal</h4>
            <Link href="#" className="footer-link">Privacy Policy</Link>
            <Link href="#" className="footer-link">Terms of Service</Link>
            <Link href="#" className="footer-link">Cookie Policy</Link>
            <Link href="#" className="footer-link">Responsible Gaming</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 ScoreDraw. All rights reserved. A platform for good.
          </p>
          <div className="flex gap-md">
            <span className="footer-copyright">Built with ❤️ for charity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
