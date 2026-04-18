'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './pricing.module.css';

export default function PricingPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="section-inner text-center">
          <div className="section-tag">💎 Pricing</div>
          <h1 className="section-title">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="section-subtitle">
            One subscription. Monthly draws. Charity contributions. No hidden fees.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section">
        <div className="section-inner">
          <div className={styles.pricingGrid}>
            {/* Monthly */}
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Monthly</h3>
                <div className={styles.pricingPrice}>
                  ₹899<span>/month</span>
                </div>
                <p className={styles.pricingDesc}>Perfect for getting started</p>
              </div>
              <div className={styles.pricingBody}>
                <ul className={styles.pricingFeatures}>
                  <li><span className={styles.featureCheck}>✓</span> Monthly draw entry</li>
                  <li><span className={styles.featureCheck}>✓</span> 5 Stableford score tracking</li>
                  <li><span className={styles.featureCheck}>✓</span> Charity contribution (10%+)</li>
                  <li><span className={styles.featureCheck}>✓</span> Full dashboard access</li>
                  <li><span className={styles.featureCheck}>✓</span> Draw results & history</li>
                  <li><span className={styles.featureCheck}>✓</span> Cancel anytime</li>
                </ul>
                <Link href="/signup" className="btn btn-secondary btn-lg w-full" id="pricing-monthly-btn">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Yearly */}
            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <div className={styles.popularBadge}>🔥 Best Value — Save 20%</div>
              <div className={styles.pricingHeader}>
                <h3 className={styles.pricingName}>Yearly</h3>
                <div className={styles.pricingPrice}>
                  ₹8,990<span>/year</span>
                </div>
                <p className={styles.pricingDesc}>Just ₹749/month — save ₹1,798!</p>
              </div>
              <div className={styles.pricingBody}>
                <ul className={styles.pricingFeatures}>
                  <li><span className={styles.featureCheck}>✓</span> 12 monthly draw entries</li>
                  <li><span className={styles.featureCheck}>✓</span> 5 Stableford score tracking</li>
                  <li><span className={styles.featureCheck}>✓</span> Charity contribution (10%+)</li>
                  <li><span className={styles.featureCheck}>✓</span> Full dashboard access</li>
                  <li><span className={styles.featureCheck}>✓</span> Draw results & history</li>
                  <li><span className={styles.featureCheck}>✓</span> Priority support</li>
                  <li><span className={styles.featureCheck}>✓</span> Save ₹1,798 per year</li>
                </ul>
                <Link href="/signup" className="btn btn-primary btn-lg w-full" id="pricing-yearly-btn">
                  🚀 Get Started — Best Value
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
              What&apos;s <span className="gradient-text">Included</span>
            </h2>
          </div>

          <div className="grid-3">
            {[
              { icon: '⛳', title: 'Score Tracking', desc: 'Enter and manage your latest 5 Stableford golf scores. Your scores become your draw numbers.' },
              { icon: '🎲', title: 'Monthly Draws', desc: 'Automatic entry into monthly draws. Match 3, 4, or all 5 numbers to win from the prize pool.' },
              { icon: '❤️', title: 'Charity Impact', desc: 'Minimum 10% goes to your chosen charity. Increase voluntarily up to 50%. Make every game count.' },
              { icon: '🏆', title: 'Prize Pools', desc: 'Growing prize pools funded by subscriptions. Jackpot rolls over when unclaimed!' },
              { icon: '📊', title: 'Full Dashboard', desc: 'Track scores, monitor draws, manage charity, and view winnings — all in one place.' },
              { icon: '🔒', title: 'Secure & Fair', desc: 'Verified draw system, secure payments, and transparent prize distribution you can trust.' },
            ].map((feature, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where does money go */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">💡 Transparency</div>
            <h2 className="section-title">
              Where Your <span className="gradient-text">Money</span> Goes
            </h2>
          </div>

          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <div className={styles.breakdownBar} style={{ height: '200px', background: 'var(--gradient-primary)' }}>
                <span>60%</span>
              </div>
              <div className={styles.breakdownLabel}>Prize Pool</div>
              <div className={styles.breakdownDesc}>Funds the monthly draws</div>
            </div>
            <div className={styles.breakdownItem}>
              <div className={styles.breakdownBar} style={{ height: '100px', background: 'var(--gradient-accent)' }}>
                <span>10-50%</span>
              </div>
              <div className={styles.breakdownLabel}>Charity</div>
              <div className={styles.breakdownDesc}>Your chosen charity</div>
            </div>
            <div className={styles.breakdownItem}>
              <div className={styles.breakdownBar} style={{ height: '80px', background: 'linear-gradient(135deg, var(--info) 0%, #60a5fa 100%)' }}>
                <span>Rest</span>
              </div>
              <div className={styles.breakdownLabel}>Platform</div>
              <div className={styles.breakdownDesc}>Operations & development</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center" style={{ padding: '4rem 2rem', background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Get Started with <span className="gradient-text">ScoreDraw</span> Today
          </h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Every subscription supports charity. Every score could be a winner. Join now.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            🚀 Subscribe Now — From ₹899/mo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
