'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { mockCharities, mockDraws, mockAdminStats } from '@/lib/mockData';
import styles from './page.module.css';

export default function HomePage() {
  const [jackpot, setJackpot] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [donated, setDonated] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const animateValue = (setter, end, duration) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    const timeout = setTimeout(() => {
      animateValue(setJackpot, 330000, 2000);
      animateValue(setSubscribers, 312, 1800);
      animateValue(setDonated, 810000, 2200);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const featuredCharities = mockCharities.filter(c => c.featured);

  return (
    <div className={styles.page}>
      {/* ═══════ HERO SECTION ═══════ */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroBackground}>
          <div className={styles.heroBg1}></div>
          <div className={styles.heroBg2}></div>
          <div className={styles.heroBg3}></div>
          <div className={styles.heroGrid}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}></span>
            Now Live — April 2026 Draw Open
          </div>
          
          <h1 className={styles.heroTitle}>
            Play Golf.<br />
            <span className="gradient-text">Win Prizes.</span><br />
            <span className="accent-gradient-text">Support Charity.</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Enter your golf scores, participate in monthly draws, and help fund 
            incredible charities. Every subscription makes a difference.
          </p>
          
          <div className={styles.heroActions}>
            <Link href="/signup" className="btn btn-primary btn-lg" id="hero-cta">
              🚀 Start Your Journey — ₹899/mo
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary btn-lg">
              Learn How It Works →
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>₹{jackpot.toLocaleString()}</div>
              <div className={styles.heroStatLabel}>Current Jackpot</div>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>{subscribers}+</div>
              <div className={styles.heroStatLabel}>Active Players</div>
            </div>
            <div className={styles.heroStatDivider}></div>
            <div className={styles.heroStat}>
              <div className={styles.heroStatValue}>₹{donated.toLocaleString()}</div>
              <div className={styles.heroStatLabel}>Raised for Charity</div>
            </div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.drawPreview}>
            <div className={styles.drawPreviewHeader}>
              <span className={styles.drawPreviewLive}>● LIVE</span>
              <span>April 2026 Draw</span>
            </div>
            <div className={styles.drawPreviewBalls}>
              {[34, 28, 41, 19, 37].map((num, i) => (
                <div key={i} className={`number-ball ${styles.heroball}`} style={{ animationDelay: `${i * 0.15}s` }}>
                  {num}
                </div>
              ))}
            </div>
            <div className={styles.drawPreviewFooter}>
              <span>🏆 5-Match Jackpot: <strong>₹{jackpot.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="section" id="how-it-works-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">✨ Simple & Rewarding</div>
            <h2 className="section-title">
              How <span className="gradient-text">ScoreDraw</span> Works
            </h2>
            <p className="section-subtitle">
              Three simple steps to start playing, winning, and giving back.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {[
              {
                step: '01',
                icon: '🎯',
                title: 'Subscribe & Choose',
                description: 'Pick your plan and select a charity to support. A portion of every subscription goes directly to your chosen cause.',
                color: 'var(--primary-500)'
              },
              {
                step: '02',
                icon: '⛳',
                title: 'Enter Your Scores',
                description: 'Submit your latest 5 Stableford golf scores. Your scores become your draw numbers — play your best game!',
                color: 'var(--accent-500)'
              },
              {
                step: '03',
                icon: '🏆',
                title: 'Win & Give',
                description: 'Monthly draws match your scores against winning numbers. Match 3, 4, or all 5 to win from the prize pool!',
                color: 'var(--info)'
              }
            ].map((item, i) => (
              <div key={i} className={`${styles.stepCard} animate-slide-up stagger-${i + 1}`}>
                <div className={styles.stepNumber} style={{ color: item.color }}>{item.step}</div>
                <div className={styles.stepIcon}>{item.icon}</div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.description}</p>
                {i < 2 && <div className={styles.stepConnector}></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRIZE POOL ═══════ */}
      <section className={`section ${styles.prizeSection}`} id="prize-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">💰 Monthly Draws</div>
            <h2 className="section-title">
              Win From the <span className="gradient-text">Prize Pool</span>
            </h2>
            <p className="section-subtitle">
              Every subscriber contributes to the monthly prize pool. The more you match, the more you win.
            </p>
          </div>

          <div className={styles.prizeGrid}>
            <div className={`${styles.prizeCard} ${styles.prizeCardJackpot}`}>
              <div className={styles.prizeCardGlow}></div>
              <div className={styles.prizeMatch}>5 Numbers</div>
              <div className={styles.prizeAmount}>40%</div>
              <div className={styles.prizeLabel}>of Prize Pool</div>
              <div className={styles.prizeFeature}>
                <span className="badge badge-warning">🔥 JACKPOT</span>
              </div>
              <div className={styles.prizeNote}>Rolls over if unclaimed!</div>
            </div>
            <div className={styles.prizeCard}>
              <div className={styles.prizeMatch}>4 Numbers</div>
              <div className={styles.prizeAmount}>35%</div>
              <div className={styles.prizeLabel}>of Prize Pool</div>
              <div className={styles.prizeFeature}>
                <span className="badge badge-accent">Strong Win</span>
              </div>
            </div>
            <div className={styles.prizeCard}>
              <div className={styles.prizeMatch}>3 Numbers</div>
              <div className={styles.prizeAmount}>25%</div>
              <div className={styles.prizeLabel}>of Prize Pool</div>
              <div className={styles.prizeFeature}>
                <span className="badge badge-info">Great Start</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED CHARITIES ═══════ */}
      <section className="section" id="charities-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">❤️ Making a Difference</div>
            <h2 className="section-title">
              Featured <span className="accent-gradient-text">Charities</span>
            </h2>
            <p className="section-subtitle">
              Your subscription directly supports these incredible organisations. Choose one when you sign up.
            </p>
          </div>

          <div className="grid-3">
            {featuredCharities.map((charity, i) => (
              <div key={charity.id} className={`card card-glow ${styles.charityCard} animate-slide-up stagger-${i + 1}`}>
                <div className={styles.charityImage}>
                  <div className={styles.charityImagePlaceholder}>
                    {charity.category === 'Youth Development' ? '👶' : 
                     charity.category === 'Veterans Support' ? '🎖️' : 
                     charity.category === 'Accessibility' ? '♿' : '🌍'}
                  </div>
                </div>
                <div className="badge badge-accent" style={{ marginBottom: '12px' }}>{charity.category}</div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>{charity.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  {charity.description.substring(0, 120)}...
                </p>
                <div className={styles.charityRaised}>
                  <span style={{ color: 'var(--success)' }}>₹{charity.total_raised.toLocaleString()}</span> raised
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/charities" className="btn btn-secondary btn-lg">
              View All Charities →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ RECENT DRAW RESULTS ═══════ */}
      <section className={`section ${styles.drawResultsSection}`} id="draw-results-section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-tag">🎲 Recent Results</div>
            <h2 className="section-title">
              Latest <span className="gradient-text">Draw Results</span>
            </h2>
          </div>

          <div className="grid-2">
            {mockDraws.filter(d => d.status === 'published').map((draw, i) => (
              <div key={draw.id} className={`card ${styles.drawResultCard}`}>
                <div className="flex justify-between items-center mb-md">
                  <h3>{draw.month} {draw.year}</h3>
                  <span className="badge badge-success">Published</span>
                </div>
                <div className="flex gap-md items-center mb-lg" style={{ justifyContent: 'center' }}>
                  {draw.winning_numbers.map((num, j) => (
                    <div key={j} className="number-ball">{num}</div>
                  ))}
                </div>
                <div className={styles.drawStats}>
                  <div className={styles.drawStatItem}>
                    <span className={styles.drawStatLabel}>Entries</span>
                    <span className={styles.drawStatValue}>{draw.entries_count}</span>
                  </div>
                  <div className={styles.drawStatItem}>
                    <span className={styles.drawStatLabel}>Prize Pool</span>
                    <span className={styles.drawStatValue}>₹{draw.prize_pool.total.toLocaleString()}</span>
                  </div>
                  <div className={styles.drawStatItem}>
                    <span className={styles.drawStatLabel}>Winners</span>
                    <span className={styles.drawStatValue}>
                      {(draw.winners?.five_match?.length || 0) + 
                       (draw.winners?.four_match?.length || 0) + 
                       (draw.winners?.three_match?.length || 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
            <Link href="/draws" className="btn btn-primary btn-lg">
              View All Draws →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className={`section ${styles.ctaSection}`} id="cta-section">
        <div className="section-inner text-center">
          <h2 className={styles.ctaTitle}>
            Ready to Be a <span className="gradient-text">Winner</span>?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join hundreds of golfers who play with purpose. Subscribe today and start making a difference.
          </p>
          <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn btn-primary btn-lg" id="cta-subscribe-btn">
              🚀 Subscribe Now — From ₹899/mo
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
