'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import styles from './how-it-works.module.css';

export default function HowItWorksPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="section-inner text-center">
          <div className="section-tag">✨ Getting Started</div>
          <h1 className="section-title">
            How <span className="gradient-text">ScoreDraw</span> Works
          </h1>
          <p className="section-subtitle">
            A unique platform that combines your love of golf with the joy of giving. 
            Here&apos;s everything you need to know.
          </p>
        </div>
      </section>

      {/* Step-by-step */}
      <section className="section">
        <div className="section-inner">
          <div className={styles.timeline}>
            {[
              {
                step: '1',
                icon: '📝',
                title: 'Create Your Account',
                description: 'Sign up with your email and choose between our monthly (₹899/mo) or yearly (₹8,990/yr) subscription plans. Pick a plan that suits you best.',
                detail: 'Your subscription fee is split between the prize pool and your chosen charity. You can cancel anytime.',
                color: 'var(--primary-500)'
              },
              {
                step: '2',
                icon: '❤️',
                title: 'Choose Your Charity',
                description: 'Browse our charity directory and select a cause close to your heart. A minimum of 10% of your subscription goes directly to them.',
                detail: 'You can increase your contribution up to 50% voluntarily. Independent donations are also welcome.',
                color: 'var(--error)'
              },
              {
                step: '3',
                icon: '⛳',
                title: 'Enter Your Golf Scores',
                description: 'Submit your latest 5 Stableford golf scores (range: 1-45). These scores become your draw numbers for that month.',
                detail: 'Only one score per date. Only the latest 5 scores are kept — new ones replace the oldest automatically.',
                color: 'var(--accent-500)'
              },
              {
                step: '4',
                icon: '🎲',
                title: 'Monthly Draw',
                description: 'At the end of each month, 5 winning numbers are drawn. They can be generated randomly or using an algorithm based on score patterns.',
                detail: 'Your 5 latest scores are compared against the winning numbers. The more matches, the bigger the prize!',
                color: 'var(--info)'
              },
              {
                step: '5',
                icon: '🏆',
                title: 'Win & Verify',
                description: 'If you match 3, 4, or all 5 numbers, you win a share of the prize pool! Upload proof of your scores and get verified by our team.',
                detail: 'Winners are paid after admin verification. The jackpot rolls over if no one matches all 5 numbers.',
                color: 'var(--warning)'
              }
            ].map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineNum} style={{ background: item.color }}>{item.step}</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineIcon}>{item.icon}</div>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDesc}>{item.description}</p>
                  <div className={styles.timelineDetail}>
                    <span className={styles.timelineDetailIcon}>💡</span>
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Distribution */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">💰 Prize Structure</div>
            <h2 className="section-title">
              Prize <span className="gradient-text">Distribution</span>
            </h2>
          </div>

          <div className={styles.prizeTable}>
            <div className={styles.prizeRow}>
              <div className={styles.prizeRowMatch}>
                <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="number-ball number-ball-matched" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>✓</div>
                  ))}
                </div>
                <span>5-Number Match</span>
              </div>
              <div className={styles.prizeRowShare}>40%</div>
              <div className={styles.prizeRowRollover}>
                <span className="badge badge-warning">Jackpot — Rolls Over</span>
              </div>
            </div>
            <div className={styles.prizeRow}>
              <div className={styles.prizeRowMatch}>
                <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} className="number-ball number-ball-matched" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>✓</div>
                  ))}
                  <div className="number-ball" style={{ width: '32px', height: '32px', fontSize: '0.75rem', opacity: 0.3 }}>×</div>
                </div>
                <span>4-Number Match</span>
              </div>
              <div className={styles.prizeRowShare}>35%</div>
              <div className={styles.prizeRowRollover}>
                <span className="badge badge-info">No Rollover</span>
              </div>
            </div>
            <div className={styles.prizeRow}>
              <div className={styles.prizeRowMatch}>
                <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
                  {[1,2,3].map(i => (
                    <div key={i} className="number-ball number-ball-matched" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>✓</div>
                  ))}
                  {[1,2].map(i => (
                    <div key={i} className="number-ball" style={{ width: '32px', height: '32px', fontSize: '0.75rem', opacity: 0.3 }}>×</div>
                  ))}
                </div>
                <span>3-Number Match</span>
              </div>
              <div className={styles.prizeRowShare}>25%</div>
              <div className={styles.prizeRowRollover}>
                <span className="badge badge-info">No Rollover</span>
              </div>
            </div>
          </div>

          <div className={styles.prizeNote}>
            <p>💡 Prizes are split equally among all winners in the same tier. The more subscribers, the bigger the pool!</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">❓ Questions</div>
            <h2 className="section-title">
              Frequently <span className="gradient-text">Asked</span>
            </h2>
          </div>

          <div className={styles.faqGrid}>
            {[
              { q: 'What is Stableford scoring?', a: 'Stableford is a scoring system in golf where points are awarded based on the number of strokes taken on each hole relative to par. Scores typically range from 0 to 45+ points.' },
              { q: 'How does the draw work?', a: 'Each month, 5 winning numbers (1-45) are generated. These are compared against your 5 latest golf scores. The more matches, the more you win from the prize pool.' },
              { q: 'Can I change my charity?', a: 'Yes! You can change your selected charity at any time through your dashboard. The change takes effect from the next billing cycle.' },
              { q: 'What happens to unclaimed jackpots?', a: 'If no one matches all 5 numbers, the jackpot (40% of the pool) rolls over to the next month, building up over time until someone wins!' },
              { q: 'How are winners verified?', a: 'Winners must upload a screenshot of their scores from their golf platform. Our admin team reviews and approves submissions before processing payment.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. You can cancel your subscription at any time from your dashboard. You\'ll retain access until the end of your billing period.' },
            ].map((faq, i) => (
              <div key={i} className={styles.faqCard}>
                <h4 className={styles.faqQuestion}>{faq.q}</h4>
                <p className={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center" style={{ padding: '4rem 2rem', background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Ready to <span className="gradient-text">Play</span>?
          </h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Join hundreds of golfers making a difference. Subscribe now and enter your first draw.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg">
            🚀 Get Started — ₹899/mo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
