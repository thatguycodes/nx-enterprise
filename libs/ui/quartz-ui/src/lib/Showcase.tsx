import React from 'react';
import { Button } from './button/Button';
import { useTheme } from './theme/ThemeContext';
import styles from './ui.module.css';

export const Showcase: React.FC = () => {
  const { mode, brand, setMode, setBrand, toggleMode } = useTheme();

  return (
    <div className={styles.container} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--core-color-storm-20)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--mode-color-generic-txt-extreme)' }}>Quartz UI Showcase</h1>
          <p style={{ color: 'var(--mode-color-generic-txt-moderate)' }}>Sophisticated, vibrant, and multi-brand.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ display: 'flex', backgroundColor: 'var(--core-color-storm-10)', padding: '0.25rem', borderRadius: 'var(--global-radius-action-m)' }}>
            <button 
              onClick={() => setMode('light')}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: 'var(--global-radius-action-s)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'light' ? 'var(--core-color-white)' : 'transparent',
                boxShadow: mode === 'light' ? 'var(--global-boxshadow-interactive-default)' : 'none',
                color: 'var(--mode-color-generic-txt-extreme)'
              }}
            >
              Light
            </button>
            <button 
              onClick={() => setMode('dark')}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: 'var(--global-radius-action-s)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'dark' ? 'var(--core-color-white)' : 'transparent',
                boxShadow: mode === 'dark' ? 'var(--global-boxshadow-interactive-default)' : 'none',
                color: 'var(--mode-color-generic-txt-extreme)'
              }}
            >
              Dark
            </button>
          </div>

          <div style={{ display: 'flex', backgroundColor: 'var(--core-color-storm-10)', padding: '0.25rem', borderRadius: 'var(--global-radius-action-m)' }}>
            <button 
              onClick={() => setBrand('quartz')}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: 'var(--global-radius-action-s)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: brand === 'quartz' ? 'var(--core-color-white)' : 'transparent',
                boxShadow: brand === 'quartz' ? 'var(--global-boxshadow-interactive-default)' : 'none',
                color: 'var(--mode-color-generic-txt-extreme)'
              }}
            >
              Quartz
            </button>
            <button 
              onClick={() => setBrand('ruby')}
              style={{ 
                padding: '0.5rem 1rem', 
                borderRadius: 'var(--global-radius-action-s)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: brand === 'ruby' ? 'var(--core-color-white)' : 'transparent',
                boxShadow: brand === 'ruby' ? 'var(--global-boxshadow-interactive-default)' : 'none',
                color: 'var(--mode-color-generic-txt-extreme)'
              }}
            >
              Ruby
            </button>
          </div>
        </div>
      </header>

      <section>
        <h2 style={{ color: 'var(--mode-color-generic-txt-severe)' }}>Buttons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Button variant="primary" size="large">Primary Action</Button>
          <Button variant="secondary" size="medium">Secondary</Button>
          <Button variant="outline" size="small">Outline</Button>
          <Button variant="primary" size="medium" disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h2 style={{ color: 'var(--mode-color-generic-txt-severe)' }}>Color Palette</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
          {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95].map(step => (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ height: '50px', backgroundColor: `var(--core-color-brand-${step})`, borderRadius: 'var(--global-radius-container-s)' }} />
              <span style={{ fontSize: '12px', color: 'var(--mode-color-generic-txt-moderate)' }}>Brand {step}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
