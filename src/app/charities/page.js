'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import styles from './charities.module.css';

export default function CharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('featured', { ascending: false });

    if (!error) {
      setCharities(data || []);
    }
    setLoading(false);
  };

  const categories = ['all', ...new Set(charities.map(c => c.category))];

  const filtered = charities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                       c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || c.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="section-inner text-center">
          <div className="section-tag">❤️ Our Partners</div>
          <h1 className="section-title">
            Charity <span className="accent-gradient-text">Directory</span>
          </h1>
          <p className="section-subtitle">
            Every subscription makes a difference. Explore the charities you can support through ScoreDraw.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className={styles.filters}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search charities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '350px' }}
              id="charity-search"
            />
            <div className="tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tab ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Spotlight */}
          {category === 'all' && !search && charities.find(c => c.featured) && (
            <div className={styles.spotlight}>
              <div className={styles.spotlightBadge}>⭐ Featured Charity</div>
              <div className={styles.spotlightContent}>
                <div className={styles.spotlightIcon}>
                  {charities.find(c => c.featured).category === 'Youth Development' ? '👶' : '🎖️'}
                </div>
                <div className={styles.spotlightInfo}>
                  <h2 className={styles.spotlightName}>{charities.find(c => c.featured).name}</h2>
                  <p className={styles.spotlightDesc}>{charities.find(c => c.featured).description}</p>
                  <div className="flex gap-md items-center" style={{ marginTop: '1rem' }}>
                    <span className="badge badge-accent">{charities.find(c => c.featured).category}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charity Grid */}
          <div className="grid-3">
            {filtered.map((charity, i) => (
              <div key={charity.id} className={`card card-glow ${styles.charityCard}`}>
                <div className={styles.charityImage}>
                  <div className={styles.charityImagePlaceholder}>
                    {charity.category === 'Youth Development' ? '👶' :
                     charity.category === 'Veterans Support' ? '🎖️' :
                     charity.category === 'Environment' ? '🌍' :
                     charity.category === 'Accessibility' ? '♿' :
                     charity.category === 'Mental Health' ? '🧠' : '🤝'}
                  </div>
                  {charity.featured && (
                    <div className={styles.featuredBadge}>⭐ Featured</div>
                  )}
                </div>
                <div className={styles.charityContent}>
                  <span className="badge badge-accent" style={{ marginBottom: '8px' }}>{charity.category}</span>
                  <h3 className={styles.charityName}>{charity.name}</h3>
                  <p className={styles.charityDesc}>{charity.description}</p>
                  <div className={styles.charityFooter}>
                    <span className="badge badge-primary">Partner</span>
                  </div>
                  {charity.events?.length > 0 && (
                    <div className={styles.charityEvents}>
                      <div className={styles.eventLabel}>Upcoming Events</div>
                      {charity.events.map((event, j) => (
                        <div key={j} className={styles.eventItem}>
                          <span>{event.title}</span>
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                            {new Date(event.date).toLocaleDateString()} · {event.location}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '4rem', color: 'var(--text-tertiary)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</p>
              <p>No charities found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
