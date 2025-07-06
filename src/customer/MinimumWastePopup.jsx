import React, { useState } from "react"
import binIcon from '/images/bin.png';

const MinimumWastePopup = ({ isOpen, onClose, onLearnMore, onDontShowAgain }) => {
  const [dontShow, setDontShow] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)

  if (!isOpen) return null

  const handleGotIt = () => {
    if (dontShow) onDontShowAgain()
    onClose()
  }

  const handleLearnMore = () => {
    if (dontShow) onDontShowAgain()
    setShowLearnMore(true)
    if (onLearnMore) onLearnMore()
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'minwaste-fadein 0.3s',
    }}>
      <style>{`
        @keyframes minwaste-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes minwaste-slidein {
          0% { transform: translateY(80px) scale(0.95); opacity: 0; }
          60% { transform: translateY(-10px) scale(1.05); opacity: 1; }
          80% { transform: translateY(0px) scale(0.98); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      <div style={{
        background: '#fff',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 40px 0 rgba(58, 95, 70, 0.25)',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        minWidth: 340,
        maxWidth: '90vw',
        textAlign: 'center',
        position: 'relative',
        animation: 'minwaste-slidein 0.5s cubic-bezier(.4,2,.6,1)',
      }}>
        <button
          onClick={onClose}
          aria-label="Close popup"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: '#3a5f46',
            border: 'none',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.18)',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#24402e'}
          onMouseOut={e => e.currentTarget.style.background = '#3a5f46'}
        >
          <img src={binIcon} alt="Close" style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain', filter: 'invert(1) brightness(2)', display: 'block', margin: '0 auto' }} />
        </button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.5rem' }}>Minimum Waste Requirement</h2>
        <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
          To ensure efficient processing, we require a minimum of <b>3kg</b> of waste for collection.
        </p>
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={handleGotIt}
            style={{
              background: '#3a5f46',
              color: '#fff',
              fontWeight: 600,
              padding: '0.6rem 2.2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.10)',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#24402e'}
            onMouseOut={e => e.currentTarget.style.background = '#3a5f46'}
          >
            Got it!
          </button>
          <button
            onClick={handleLearnMore}
            style={{
              background: '#eee',
              color: '#333',
              fontWeight: 600,
              padding: '0.6rem 2.2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.10)',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#e0e0e0'}
            onMouseOut={e => e.currentTarget.style.background = '#eee'}
          >
            Learn more
          </button>
        </div>
        {showLearnMore && (
          <div style={{ marginTop: '1rem', color: '#3a5f46', fontWeight: 500, fontSize: '1rem', background: '#f3f6f4', borderRadius: '0.5rem', padding: '1rem' }}>
            Learn more: For more information about our minimum waste policy, please visit our FAQ or contact support.
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'start' }}>
          <input
            id="dont-show-again"
            type="checkbox"
            checked={dontShow}
            onChange={e => setDontShow(e.target.checked)}
            style={{ width: '1.25rem', height: '1.25rem', accentColor: '#3a5f46', border: '1px solid #ccc', borderRadius: '0.25rem' }}
          />
          <label htmlFor="dont-show-again" style={{ color: '#333', fontSize: '1rem', userSelect: 'none', cursor: 'pointer' }}>
            Don't show again
          </label>
        </div>
      </div>
    </div>
  )
}

export default MinimumWastePopup 