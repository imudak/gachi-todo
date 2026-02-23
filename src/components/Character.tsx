import React from 'react'

interface CharacterProps {
  state: 'idle' | 'happy'
}

const Star = ({ style }: { style?: React.CSSProperties }) => (
  <div
    className="absolute text-yellow-400 text-2xl star-burst pointer-events-none select-none"
    style={style}
    aria-hidden="true"
  >
    ⭐
  </div>
)

export const Character: React.FC<CharacterProps> = ({ state }) => {
  return (
    <div className="relative inline-block" data-testid="character">
      <div
        className={state === 'happy' ? 'character-happy' : 'character-idle'}
        aria-label={
          state === 'happy' ? 'キャラクターが喜んでいます' : 'キャラクターが待機中です'
        }
        role="img"
      >
        <svg
          viewBox="0 0 100 100"
          width="130"
          height="130"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 体 */}
          <ellipse cx="50" cy="74" rx="22" ry="16" fill="#FCD34D" />
          {/* 頭 */}
          <circle cx="50" cy="43" r="28" fill="#FCD34D" />

          {/* 通常の目 */}
          {state === 'idle' && (
            <>
              <circle cx="40" cy="39" r="5" fill="#1F2937" />
              <circle cx="60" cy="39" r="5" fill="#1F2937" />
              <circle cx="42" cy="37" r="1.8" fill="white" />
              <circle cx="62" cy="37" r="1.8" fill="white" />
            </>
          )}

          {/* ハッピーな目（三日月形） */}
          {state === 'happy' && (
            <>
              <path
                d="M 35 41 Q 40 35 45 41"
                stroke="#1F2937"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 55 41 Q 60 35 65 41"
                stroke="#1F2937"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              {/* ほっぺ */}
              <circle cx="32" cy="53" r="7" fill="#FCA5A5" opacity="0.55" />
              <circle cx="68" cy="53" r="7" fill="#FCA5A5" opacity="0.55" />
            </>
          )}

          {/* 口 */}
          {state === 'idle' ? (
            <path
              d="M 41 51 Q 50 57 59 51"
              stroke="#1F2937"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 36 52 Q 50 66 64 52"
              stroke="#1F2937"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {state === 'happy' && (
        <>
          <Star style={{ top: '-12px', left: '-18px', animationDelay: '0s' }} />
          <Star
            style={{ top: '-18px', right: '-14px', animationDelay: '0.18s' }}
          />
          <Star
            style={{ bottom: '8px', left: '-22px', animationDelay: '0.35s' }}
          />
        </>
      )}
    </div>
  )
}
