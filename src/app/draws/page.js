'use client';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { mockDraws } from '@/lib/mockData';
import styles from './draws.module.css';

export default function DrawsPage() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="section-inner text-center">
          <div className="section-tag">🎲 Monthly Draws</div>
          <h1 className="section-title">
            Draw <span className="gradient-text">Results</span>
          </h1>
          <p className="section-subtitle">
            Check the latest draw results and see if your scores matched. New draws happen every month!
          </p>
        </div>
      </section>

      {/* How Matching Works */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '1.75rem' }}>
              How <span className="gradient-text">Matching</span> Works
            </h2>
          </div>

          <div className={styles.matchGrid}>
            <div className={styles.matchCard}>
              <div className={styles.matchBalls}>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball" style={{ opacity: 0.3 }}>×</div>
                <div className="number-ball" style={{ opacity: 0.3 }}>×</div>
              </div>
              <h3>3-Number Match</h3>
              <p className={styles.matchShare}>25% of pool</p>
              <span className="badge badge-info">Starting Tier</span>
            </div>
            <div className={styles.matchCard}>
              <div className={styles.matchBalls}>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball" style={{ opacity: 0.3 }}>×</div>
              </div>
              <h3>4-Number Match</h3>
              <p className={styles.matchShare}>35% of pool</p>
              <span className="badge badge-accent">Strong Win</span>
            </div>
            <div className={`${styles.matchCard} ${styles.matchCardJackpot}`}>
              <div className={styles.matchBalls}>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
                <div className="number-ball number-ball-matched">✓</div>
              </div>
              <h3>5-Number Match</h3>
              <p className={styles.matchShare}>40% of pool</p>
              <span className="badge badge-warning">🔥 JACKPOT</span>
              <p className={styles.matchNote}>Rolls over if unclaimed!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Draw Results */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-inner">
          <h2 className="section-title text-center" style={{ marginBottom: '2rem' }}>
            All <span className="gradient-text">Draw Results</span>
          </h2>

          <div className="flex flex-col gap-xl">
            {mockDraws.map((draw, i) => (
              <div key={draw.id} className={`card ${styles.drawCard}`}>
                <div className={styles.drawHeader}>
                  <div>
                    <h3 className={styles.drawMonth}>{draw.month} {draw.year}</h3>
                    <div className="flex gap-sm items-center">
                      <span className={`badge ${draw.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                        {draw.status}
                      </span>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{draw.type}</span>
                    </div>
                  </div>
                  <div className={styles.drawPool}>
                    <div className={styles.drawPoolLabel}>Total Pool</div>
                    <div className={styles.drawPoolValue}>₹{draw.prize_pool.total.toLocaleString()}</div>
                  </div>
                </div>

                {draw.winning_numbers && (
                  <>
                    <div className={styles.drawNumbers}>
                      <div className={styles.drawNumbersLabel}>Winning Numbers</div>
                      <div className="flex gap-md" style={{ justifyContent: 'center' }}>
                        {draw.winning_numbers.map((num, j) => (
                          <div key={j} className="number-ball number-ball-lg">{num}</div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.drawTiers}>
                      <div className={styles.drawTier}>
                        <div className={styles.drawTierName}>5-Match (40%)</div>
                        <div className={styles.drawTierPool}>₹{draw.prize_pool.five_match.toLocaleString()}</div>
                        <div className={styles.drawTierWinners}>
                          {draw.winners?.five_match?.length || 0} winner(s)
                          {draw.jackpot_rollover ? (
                            <span className="badge badge-warning" style={{ marginLeft: '8px' }}>Rolled Over</span>
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.drawTier}>
                        <div className={styles.drawTierName}>4-Match (35%)</div>
                        <div className={styles.drawTierPool}>₹{draw.prize_pool.four_match.toLocaleString()}</div>
                        <div className={styles.drawTierWinners}>
                          {draw.winners?.four_match?.length || 0} winner(s)
                        </div>
                      </div>
                      <div className={styles.drawTier}>
                        <div className={styles.drawTierName}>3-Match (25%)</div>
                        <div className={styles.drawTierPool}>₹{draw.prize_pool.three_match.toLocaleString()}</div>
                        <div className={styles.drawTierWinners}>
                          {draw.winners?.three_match?.length || 0} winner(s)
                        </div>
                      </div>
                    </div>

                    {draw.winners && (
                      <div className={styles.drawWinnersList}>
                        <div className={styles.drawWinnersLabel}>Winners</div>
                        {draw.winners.four_match?.map((w, j) => (
                          <div key={`4-${j}`} className={styles.winnerItem}>
                            <span>🏆 {w.user_name}</span>
                            <span className={styles.winnerMatch}>4-Match</span>
                            <span className={styles.winnerPrize}>₹{w.prize.toFixed(0)}</span>
                          </div>
                        ))}
                        {draw.winners.three_match?.map((w, j) => (
                          <div key={`3-${j}`} className={styles.winnerItem}>
                            <span>🎉 {w.user_name}</span>
                            <span className={styles.winnerMatch}>3-Match</span>
                            <span className={styles.winnerPrize}>₹{w.prize.toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {!draw.winning_numbers && (
                  <div className={styles.drawUpcoming}>
                    <p>🎲 Draw not yet completed</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{draw.entries_count} entries so far</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center" style={{ padding: '4rem 2rem' }}>
        <div className="section-inner">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Want to <span className="gradient-text">Participate</span>?
          </h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Subscribe and enter your golf scores for a chance to win every month.
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
