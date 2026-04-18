'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';
import styles from './signup.module.css';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'monthly',
    charity_id: '',
    charity_percentage: 10,
  });
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase.from('charities').select('*');
      if (data) setCharities(data);
    };
    fetchCharities();
  }, []);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      addToast('Please fill in all fields', 'error');
      return;
    }
    if (step === 2 && !formData.plan) {
      addToast('Please select a plan', 'error');
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!formData.charity_id) {
      addToast('Please select a charity', 'error');
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.name,
        formData.charity_id,
        formData.charity_percentage
      );
      if (error) {
        addToast(error.message, 'error');
      } else {
        addToast('Welcome to ScoreDraw! 🎉', 'success');
        router.push('/dashboard');
      }
    } catch (err) {
      addToast('Something went wrong', 'error');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className={styles.steps}>
          {['Account', 'Plan', 'Charity'].map((label, i) => (
            <div key={i} className={`${styles.stepIndicator} ${step > i ? styles.stepDone : ''} ${step === i + 1 ? styles.stepActive : ''}`}>
              <div className={styles.stepDot}>{step > i + 1 ? '✓' : i + 1}</div>
              <span className={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Account Details */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Create Your Account</h2>
            <p className={styles.stepSubtitle}>Start your journey to play, win, and give back.</p>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                id="signup-name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="john@email.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                id="signup-email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                id="signup-password"
              />
            </div>

            <button onClick={nextStep} className="btn btn-primary btn-lg w-full" id="signup-next-1">
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Choose Plan */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Choose Your Plan</h2>
            <p className={styles.stepSubtitle}>Select a subscription to start participating in draws.</p>

            <div className={styles.planGrid}>
              <div
                className={`${styles.planCard} ${formData.plan === 'monthly' ? styles.planActive : ''}`}
                onClick={() => updateField('plan', 'monthly')}
                id="plan-monthly"
              >
                <div className={styles.planName}>Monthly</div>
                <div className={styles.planPrice}>₹899<span>/mo</span></div>
                <ul className={styles.planFeatures}>
                  <li>✓ Monthly draw entry</li>
                  <li>✓ Score tracking</li>
                  <li>✓ Charity contribution</li>
                  <li>✓ Cancel anytime</li>
                </ul>
              </div>

              <div
                className={`${styles.planCard} ${styles.planPopular} ${formData.plan === 'yearly' ? styles.planActive : ''}`}
                onClick={() => updateField('plan', 'yearly')}
                id="plan-yearly"
              >
                <div className={styles.planBadge}>Save 20%</div>
                <div className={styles.planName}>Yearly</div>
                <div className={styles.planPrice}>₹8,990<span>/yr</span></div>
                <div className={styles.planPerMonth}>Just ₹749/month</div>
                <ul className={styles.planFeatures}>
                  <li>✓ All monthly features</li>
                  <li>✓ 12 draw entries</li>
                  <li>✓ Priority support</li>
                  <li>✓ Save ₹1,798/year</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-md" style={{ marginTop: '1.5rem' }}>
              <button onClick={prevStep} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
                ← Back
              </button>
              <button onClick={nextStep} className="btn btn-primary btn-lg" style={{ flex: 2 }} id="signup-next-2">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Choose Charity */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.stepTitle}>Choose Your Charity</h2>
            <p className={styles.stepSubtitle}>
              A minimum of 10% of your subscription goes to your chosen charity.
            </p>

            <div className="form-group">
              <label className="form-label">Contribution Percentage: {formData.charity_percentage}%</label>
              <input
                type="range"
                min="10"
                max="50"
                value={formData.charity_percentage}
                onChange={(e) => updateField('charity_percentage', parseInt(e.target.value))}
                className={styles.rangeInput}
                id="charity-percentage"
              />
              <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                <span>10% (min)</span>
                <span>50% (max)</span>
              </div>
            </div>

            <div className={styles.charityGrid}>
              {charities.map(charity => (
                <div
                  key={charity.id}
                  className={`${styles.charityOption} ${formData.charity_id === charity.id ? styles.charitySelected : ''}`}
                  onClick={() => updateField('charity_id', charity.id)}
                  id={`charity-${charity.id}`}
                >
                  <div className={styles.charityOptionIcon}>
                    {charity.category === 'Youth Development' ? '👶' :
                     charity.category === 'Veterans Support' ? '🎖️' :
                     charity.category === 'Environment' ? '🌍' :
                     charity.category === 'Accessibility' ? '♿' :
                     charity.category === 'Mental Health' ? '🧠' : '🤝'}
                  </div>
                  <div>
                    <div className={styles.charityOptionName}>{charity.name}</div>
                    <div className={styles.charityOptionCategory}>{charity.category}</div>
                  </div>
                  {formData.charity_id === charity.id && (
                    <span className={styles.charityCheck}>✓</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-md" style={{ marginTop: '1.5rem' }}>
              <button onClick={prevStep} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary btn-lg"
                style={{ flex: 2 }}
                disabled={loading}
                id="signup-submit"
              >
                {loading ? 'Creating Account...' : '🚀 Complete Signup'}
              </button>
            </div>
          </div>
        )}

        <p className={styles.loginLink}>
          Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
