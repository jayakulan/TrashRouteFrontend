import React, { useState } from "react";
import { X } from "lucide-react";

const MinimumWastePopup = ({ isOpen, onClose, onLearnMore, onDontShowAgain, closeIcon }) => {
  // Always use /images/close.png unless a different closeIcon is provided
  const icon = closeIcon || "/images/close.png";
  const [dontShow, setDontShow] = useState(false);

  if (!isOpen) return null;

  const handleGotIt = () => {
    if (dontShow) onDontShowAgain();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        animation: 'minwaste-fadein 0.3s',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
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

      <div
        style={{
          background: '#fff',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 40px 0 rgba(58, 95, 70, 0.25)',
          padding: '2.5rem',
          minWidth: 340,
          maxWidth: '90vw',
          textAlign: 'center',
          position: 'relative',
          animation: 'minwaste-slidein 0.5s cubic-bezier(.4,2,.6,1)',
        }}
      >
        {/* Removed close button here */}

        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#3a5f46',
            marginBottom: '0.5rem',
          }}
        >
          Minimum Waste Requirement
        </h2>

        <p
          style={{
            fontSize: '1.1rem',
            color: '#333',
            marginBottom: '1.5rem',
          }}
        >
          To request a pickup, you must have at least 3 kg of waste.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
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
            onMouseOver={e => (e.currentTarget.style.background = '#24402e')}
            onMouseOut={e => (e.currentTarget.style.background = '#3a5f46')}
          >
            Got it!
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'start',
          }}
        >
          <input
            id="dont-show-again"
            type="checkbox"
            checked={dontShow}
            onChange={e => setDontShow(e.target.checked)}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              accentColor: '#3a5f46',
              border: '1px solid #ccc',
              borderRadius: '0.25rem',
            }}
          />
          <label
            htmlFor="dont-show-again"
            style={{
              color: '#333',
              fontSize: '1rem',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            Don't show again
          </label>
        </div>
      </div>
    </div>
  );
};

export default MinimumWastePopup;
