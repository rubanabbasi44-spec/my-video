import React, {useCallback, useRef} from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from 'remotion';

/* ============================================================
   SR-71 TOTAL TEMPERATURE EXPLAINER — SHARED HELPERS
   1920x1080 @ 24 fps (Veo is 24 fps, so no judder)
   ============================================================ */

export const FPS = 24;
export const W = 1920;
export const H = 1080;
export const sec = (t: number) => Math.round(t * FPS);
// mk(sceneStartSeconds) -> converts an ABSOLUTE script time into a scene-LOCAL frame
export const mk = (a: number) => (t: number) => sec(t) - sec(a);
export const TOTAL = sec(72.1);

// ---- switches -------------------------------------------------
export const VOICE_FILE = 'voice.mp3'; // file name inside /public
export const USE_VEO = false; // set true once clips are in /public/veo/
export const USE_SFX = false; // set true once sounds are in /public/sfx/

export const C = {
  bg: '#E9ECEF',
  bg2: '#F7F8FA',
  ink: '#1B1F24',
  mute: '#8A929C',
  line: '#C9CED4',
  steel: '#6B7380',
  steelDark: '#3D434C',
  blue: '#2F80ED',
  green: '#2FA866',
  orange: '#FF8A1F',
  red: '#E5322D',
  olive: '#6B7A3A',
};
export const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIO = Easing.bezier(0.45, 0, 0.55, 1);

export const prog = (
  f: number,
  start: number,
  dur: number,
  ease: (n: number) => number = easeOut
) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------- background + finishing ---------------- */

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.15) % 80;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${C.bg2} 0%, ${C.bg} 70%, #D8DCE0 100%)`,
      }}
    >
      <svg width={W} height={H} style={{position: 'absolute'}}>
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${-drift} 0)`}
          >
            <path d="M80 0H0V80" fill="none" stroke={C.line} strokeWidth="1" opacity="0.5" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
      </svg>
    </AbsoluteFill>
  );
};

// One common vignette + grain over EVERYTHING (Remotion + Veo) so they look like one camera.
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.18) 100%)',
        }}
      />
      <svg
        width={W}
        height={H}
        style={{position: 'absolute', opacity: 0.07, mixBlendMode: 'multiply'}}
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 7} />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------------- scene wrapper (fade + slow push-in) ---------------- */

const SceneInner: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(f, [dur - 6, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
  );
  const z = interpolate(f, [0, dur], [1, 1.025]);
  return <AbsoluteFill style={{opacity: op, transform: `scale(${z})`}}>{children}</AbsoluteFill>;
};

// a, b = absolute seconds. Scene runs 6 extra frames so it cross-fades into the next scene.
export const Scene: React.FC<{a: number; b: number; children: React.ReactNode}> = ({
  a,
  b,
  children,
}) => {
  const dur = sec(b) - sec(a) + 6;
  return (
    <Sequence from={sec(a)} durationInFrames={dur}>
      <SceneInner dur={dur}>{children}</SceneInner>
    </Sequence>
  );
};

/* ---------------- motion helpers ---------------- */

type Side = 'left' | 'right' | 'top' | 'bottom' | 'none';
const vec = (s: Side): [number, number] =>
  s === 'left' ? [-1, 0] : s === 'right' ? [1, 0] : s === 'top' ? [0, -1] : s === 'bottom' ? [0, 1] : [0, 0];

// Reveal: puts children CENTERED at (x,y). Enters from `from` side, exits to `to` side.
export const Reveal: React.FC<{
  x: number;
  y: number;
  at: number; // entry start (local frame)
  dur?: number; // entry duration
  from?: Side;
  to?: Side;
  out?: number; // exit start (local frame)
  outDur?: number;
  dist?: number; // slide distance in px
  pop?: number; // start scale (0.92 = subtle)
  children: React.ReactNode;
}> = ({x, y, at, dur = 16, from = 'none', to, out, outDur = 12, dist = 240, pop = 0.92, children}) => {
  const f = useCurrentFrame();
  const pi = prog(f, at, dur);
  const po = out === undefined ? 0 : prog(f, out, outDur, easeIO);
  const [ix, iy] = vec(from);
  const [ox, oy] = vec(to ?? from);
  const dx = ix * dist * (1 - pi) + ox * dist * po;
  const dy = iy * dist * (1 - pi) + oy * dist * po;
  const sc = (pop + (1 - pop) * pi) * (1 - 0.04 * po);
  const op = pi * (1 - po);
  if (op <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: op,
        transform: `translate(${dx}px,${dy}px) scale(${sc})`,
      }}
    >
      <div style={{transform: 'translate(-50%,-50%)'}}>{children}</div>
    </div>
  );
};

export const Layer: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
    {children}
  </svg>
);

export const Line: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  dur?: number;
  out?: number;
  color?: string;
  width?: number;
  dash?: string;
}> = ({x1, y1, x2, y2, at, dur = 18, out, color = C.ink, width = 6, dash}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  const o = out === undefined ? 1 : 1 - prog(f, out, 10, easeIO);
  if (p <= 0 || o <= 0) return null;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x1 + (x2 - x1) * p}
      y2={y1 + (y2 - y1) * p}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash}
      opacity={o}
    />
  );
};

export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  dur?: number;
  out?: number;
  color?: string;
  width?: number;
  dash?: string;
}> = ({x1, y1, x2, y2, at, dur = 20, out, color = C.ink, width = 10, dash}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  const o = out === undefined ? 1 : 1 - prog(f, out, 10, easeIO);
  if (p <= 0 || o <= 0) return null;
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const hs = width * 3.2;
  const headOp = interpolate(p, [0.85, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <g opacity={o}>
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * p}
        y2={y1 + (y2 - y1) * p}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <polygon
        points={`0,0 ${-hs},${-hs * 0.55} ${-hs},${hs * 0.55}`}
        fill={color}
        transform={`translate(${x2} ${y2}) rotate(${ang})`}
        opacity={headOp}
      />
    </g>
  );
};

export const Ring: React.FC<{
  x: number;
  y: number;
  at: number;
  color?: string;
  r0?: number;
  r1?: number;
  dur?: number;
}> = ({x, y, at, color = C.orange, r0 = 20, r1 = 130, dur = 26}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur, easeOut);
  if (f < at || p >= 1) return null;
  return (
    <circle cx={x} cy={y} r={r0 + (r1 - r0) * p} fill="none" stroke={color} strokeWidth={7} opacity={1 - p} />
  );
};

export const Num: React.FC<{
  from: number;
  to: number;
  at: number;
  dur: number;
  dec?: number;
  prefix?: string;
  suffix?: string;
  size?: number;
  color?: string;
}> = ({from, to, at, dur, dec = 0, prefix = '', suffix = '', size = 100, color = C.ink}) => {
  const f = useCurrentFrame();
  const v = from + (to - from) * prog(f, at, dur, easeIO);
  const s = v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec});
  return (
    <span
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        color,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        textShadow: '0 6px 18px rgba(0,0,0,0.12)',
      }}
    >
      {prefix}
      {s}
      {suffix}
    </span>
  );
};

export const Tag: React.FC<{text: string; color?: string; size?: number; solid?: boolean}> = ({
  text,
  color = C.ink,
  size = 44,
  solid = false,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 2,
      color: solid ? '#fff' : color,
      background: solid ? color : 'rgba(255,255,255,0.92)',
      border: `4px solid ${color}`,
      borderRadius: size,
      padding: `${size * 0.18}px ${size * 0.6}px`,
      whiteSpace: 'nowrap',
      boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
    }}
  >
    {text}
  </div>
);

export const Sfx: React.FC<{at: number; file: string; volume?: number}> = ({at, file, volume = 0.6}) =>
  USE_SFX ? (
    <Sequence from={at}>
      <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
    </Sequence>
  ) : null;

export const VoiceOver: React.FC = () => <Audio src={staticFile(VOICE_FILE)} />;

/* ---------------- Veo green-screen clip (chroma key) ---------------- */

export const VeoClip: React.FC<{file: string; fallback: React.ReactNode}> = ({file, fallback}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const onFrame = useCallback((frame: CanvasImageSource) => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d', {willReadFrequently: true});
    if (!ctx) return;
    ctx.drawImage(frame, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const m = Math.max(r, b);
      const k = g - m; // how "green" the pixel is
      if (k > 45) {
        d[i + 3] = 0;
      } else if (k > 12) {
        d[i + 3] = Math.round(255 * (1 - (k - 12) / 33));
        d[i + 1] = m; // despill
      } else if (k > 0) {
        d[i + 1] = m; // light despill on edges
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  if (!USE_VEO) return <>{fallback}</>;
  return (
    <AbsoluteFill>
      <canvas ref={ref} width={1280} height={720} style={{width: W, height: H}} />
      <OffthreadVideo
        src={staticFile(`veo/${file}`)}
        muted
        onVideoFrame={onFrame}
        style={{position: 'absolute', opacity: 0, width: 10, height: 10}}
      />
    </AbsoluteFill>
  );
};

/* ---------------- icons ---------------- */

export const Cross: React.FC<{size?: number; color?: string; p: number}> = ({size = 120, color = C.red, p}) => {
  const a = Math.min(1, p * 2);
  const b = Math.max(0, Math.min(1, p * 2 - 1));
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <line x1="14" y1="14" x2={14 + 92 * a} y2={14 + 92 * a} stroke={color} strokeWidth="16" strokeLinecap="round" />
      <line x1="106" y1="14" x2={106 - 92 * b} y2={14 + 92 * b} stroke={color} strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
};

export const Check: React.FC<{size?: number; color?: string; p: number}> = ({size = 120, color = C.green, p}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <polyline
      points="15,65 45,95 105,25"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
      fill="none"
      stroke={color}
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const QMark: React.FC<{size?: number; color?: string}> = ({size = 160, color = C.red}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color, lineHeight: 1}}>?</div>
);

export const Warn: React.FC<{size?: number; color?: string}> = ({size = 220, color = C.orange}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <polygon points="60,10 112,105 8,105" fill="#fff" stroke={color} strokeWidth="9" strokeLinejoin="round" />
    <line x1="60" y1="43" x2="60" y2="74" stroke={color} strokeWidth="9" strokeLinecap="round" />
    <circle cx="60" cy="90" r="5.5" fill={color} />
  </svg>
);

export const Snow: React.FC<{size?: number; color?: string}> = ({size = 200, color = C.blue}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120">
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`}>
        <line x1="-50" y1="0" x2="50" y2="0" stroke={color} strokeWidth="7" strokeLinecap="round" />
        <polyline points="-38,-10 -50,0 -38,10" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <polyline points="38,-10 50,0 38,10" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

export const Flame: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 100 110">
    <path
      d="M50 5 C58 30 85 40 85 72 C85 94 68 106 50 106 C32 106 15 94 15 72 C15 52 28 44 34 24 C40 34 44 40 50 5Z"
      fill={C.orange}
      stroke={C.ink}
      strokeWidth="4"
    />
    <path d="M50 52 C56 64 68 68 68 82 C68 93 60 100 50 100 C40 100 32 93 32 82 C32 70 44 64 50 52Z" fill="#FFD27A" />
  </svg>
);

export const Waves: React.FC<{size?: number; color?: string}> = ({size = 160, color = C.orange}) => (
  <svg width={size} height={size * 1.1} viewBox="-10 -10 130 150">
    {[20, 60, 100].map((x) => (
      <path
        key={x}
        d={`M${x} 125 q-20 -25 0 -50 t0 -50`}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

export const SpeedIcon: React.FC<{size?: number; color?: string}> = ({size = 200, color = C.ink}) => (
  <svg width={size} height={size * 0.625} viewBox="0 0 160 100">
    <line x1="10" y1="25" x2="90" y2="25" stroke={color} strokeWidth="8" strokeLinecap="round" />
    <line x1="0" y1="50" x2="115" y2="50" stroke={color} strokeWidth="8" strokeLinecap="round" />
    <line x1="22" y1="75" x2="100" y2="75" stroke={color} strokeWidth="8" strokeLinecap="round" />
    <polygon points="118,18 158,50 118,82" fill={color} />
  </svg>
);

export const Dial: React.FC<{size?: number; needle?: number; color?: string}> = ({
  size = 320,
  needle = 0.9,
  color = C.ink,
}) => {
  const th = -90 + needle * 180;
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return {x: 100 + r * Math.sin(a), y: 120 - r * Math.cos(a)};
  };
  const tip = pt(th, 62);
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 200 144">
      <path d="M20 120 A80 80 0 0 1 180 120" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const a = pt(-90 + i * 30, 66);
        const b = pt(-90 + i * 30, 78);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="4" />;
      })}
      <line x1="100" y1="120" x2={tip.x} y2={tip.y} stroke={C.red} strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="120" r="9" fill={color} />
    </svg>
  );
};

/* ---------------- Jet (stand-in; Veo replaces it on hero scenes) ---------------- */

export const Jet: React.FC<{width?: number; heat?: number; rot?: number}> = ({width = 800, heat = 0, rot = 0}) => {
  const hc = interpolateColors(heat, [0, 0.5, 1], [C.steel, C.orange, C.red]);
  const body = interpolateColors(heat, [0, 1], [C.steelDark, '#7A3B2A']);
  const wing = (
    <g>
      <polygon points="230,124 400,26 470,26 452,124" fill="#7A8290" stroke={C.ink} strokeWidth="3" />
      <line x1="230" y1="124" x2="400" y2="26" stroke={hc} strokeWidth="9" strokeLinecap="round" />
      <rect x="300" y="58" width="150" height="26" rx="13" fill="#4A515C" stroke={C.ink} strokeWidth="3" />
    </g>
  );
  return (
    <svg
      width={width}
      height={width * 0.40625}
      viewBox="0 0 640 260"
      style={{filter: 'drop-shadow(0 22px 18px rgba(0,0,0,0.25))', transform: `rotate(${rot}deg)`}}
    >
      {wing}
      <g transform="translate(0 260) scale(1 -1)">{wing}</g>
      <polygon
        points="30,128 300,119 560,123 625,130 560,137 300,141 30,132"
        fill={body}
        stroke={C.ink}
        strokeWidth="3"
      />
      <polygon points="560,123 625,130 560,137" fill={hc} />
      <rect x="40" y="96" width="70" height="20" rx="6" fill="#4A515C" stroke={C.ink} strokeWidth="3" />
      <rect x="40" y="144" width="70" height="20" rx="6" fill="#4A515C" stroke={C.ink} strokeWidth="3" />
    </svg>
  );
};

export const Streaks: React.FC<{
  n?: number;
  speed: number;
  y0: number;
  y1: number;
  len?: number;
  color?: string;
  opacity?: number;
  at?: number;
}> = ({n = 26, speed, y0, y1, len = 240, color = C.blue, opacity = 0.55, at = 0}) => {
  const f = useCurrentFrame();
  const a = prog(f, at, 14);
  if (a <= 0) return null;
  const lines = [];
  for (let i = 0; i < n; i++) {
    const y = y0 + rnd(i) * (y1 - y0);
    const sp = speed * (0.7 + rnd(i + 50) * 0.6);
    const l = len * (0.5 + rnd(i + 90));
    const x = (((rnd(i + 7) * W - f * sp) % W) + W) % W;
    lines.push(
      <line key={i} x1={x} y1={y} x2={x + l} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={opacity * a} />
    );
  }
  return <g>{lines}</g>;
};

/* ---------------- Thermometer ---------------- */

export const Thermo: React.FC<{
  value: number;
  min?: number;
  max?: number;
  limit?: number;
  limitP?: number;
  showValue?: boolean;
  scale?: number;
  pulse?: boolean;
}> = ({value, min = 0, max = 500, limit, limitP = 0, showValue = true, scale = 1, pulse = false}) => {
  const f = useCurrentFrame();
  const v = Math.max(min, Math.min(max, value));
  const y = (t: number) => 560 - ((t - min) / (max - min)) * 520;
  const col = interpolateColors(Math.max(-100, Math.min(427, value)), [-100, 0, 250, 427], [C.blue, '#6FB1F5', C.orange, C.red]);
  const yv = y(v);
  const ticks = [];
  for (let t = Math.ceil(min / 100) * 100; t <= max; t += 100) {
    ticks.push(
      <g key={t}>
        <line x1="60" y1={y(t)} x2="85" y2={y(t)} stroke={C.ink} strokeWidth="4" />
        <text x="50" y={y(t) + 9} textAnchor="end" fontFamily={FONT} fontSize="26" fill={C.mute} fontWeight="700">
          {t}
        </text>
      </g>
    );
  }
  const glow = pulse ? 8 + 10 * Math.abs(Math.sin(f / 5)) : 0;
  return (
    <svg
      width={460 * scale}
      height={700 * scale}
      viewBox="0 0 460 700"
      style={{overflow: 'visible', filter: pulse ? `drop-shadow(0 0 ${glow}px ${C.red})` : undefined}}
    >
      <rect x="85" y="40" width="70" height="520" rx="35" fill="#fff" stroke={C.ink} strokeWidth="6" />
      <circle cx="120" cy="600" r="62" fill="#fff" stroke={C.ink} strokeWidth="6" />
      <rect x="96" y={yv} width="48" height={590 - yv} fill={col} />
      <circle cx="120" cy="600" r="50" fill={col} />
      {ticks}
      {limit !== undefined && limitP > 0 && (
        <g>
          <line
            x1="60"
            y1={y(limit)}
            x2={60 + limitP * 380}
            y2={y(limit)}
            stroke={C.red}
            strokeWidth="6"
            strokeDasharray="14 10"
          />
          {limitP > 0.8 && (
            <text x="440" y={y(limit) - 14} textAnchor="end" fontFamily={FONT} fontSize="32" fontWeight="800" fill={C.red}>
              LIMIT
            </text>
          )}
        </g>
      )}
      {showValue && (
        <text x="185" y={yv + 12} fontFamily={FONT} fontSize="46" fontWeight="800" fill={col}>
          {Math.round(value)}°C
        </text>
      )}
    </svg>
  );
};

/* ---------------- Engine inlet diagram (side cutaway) ---------------- */

// local coordinates 0..1000 x 0..460, centre (500,230)
export const ip = (cx: number, cy: number, s: number, lx: number, ly: number) => ({
  x: cx + (lx - 500) * s,
  y: cy + (ly - 230) * s,
});

export const InletDiagram: React.FC<{
  scale?: number;
  flowAt?: number;
  hot?: number; // 0..1 how hot the air gets after the throat
  probeP?: number; // 0..1 probe highlight
  shockP?: number; // 0..1 shock lines drawn
  glow?: number; // 0..1 red glow at compressor face
}> = ({scale = 1.4, flowAt = 0, hot = 0, probeP = 0, shockP = 0, glow = 0}) => {
  const f = useCurrentFrame();
  const air = prog(f, flowAt, 14);
  const warm = interpolateColors(hot, [0, 0.5, 1], [C.blue, C.orange, C.red]);
  const parts = [];
  for (let i = 0; i < 54; i++) {
    const yy = 104 + rnd(i) * 92;
    const y = i % 2 ? 460 - yy : yy;
    const u = (rnd(i + 40) + f * 0.02) % 1;
    const x = u < 0.35 ? (u / 0.35) * 0.6 : 0.6 + ((u - 0.35) / 0.65) * 0.4; // fast, then slowed down
    const sp = u < 0.35 ? 1.71 : 0.615;
    const px = 40 + x * 860;
    const len = 10 + sp * 34;
    const m = Math.max(0, Math.min(1, (x - 0.6) / 0.15));
    const col = interpolateColors(m, [0, 1], [C.blue, warm]);
    parts.push(
      <line key={i} x1={px - len} y1={y} x2={px} y2={y} stroke={col} strokeWidth={4} strokeLinecap="round" opacity={air * (0.5 + rnd(i + 80) * 0.5)} />
    );
  }
  const pr = 18 + 14 * Math.abs(Math.sin(f / 5));
  return (
    <svg width={1000 * scale} height={460 * scale} viewBox="0 0 1000 460" style={{overflow: 'visible'}}>
      <defs>
        <clipPath id="chan">
          <polygon points="120,100 360,170 900,170 900,200 360,200 40,230" />
          <polygon points="120,360 360,290 900,290 900,260 360,260 40,230" />
        </clipPath>
        <radialGradient id="hotglow">
          <stop offset="0" stopColor={C.red} stopOpacity="0.85" />
          <stop offset="1" stopColor={C.red} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* outer shell layer + cowl layer */}
      <polyline points="110,86 366,156 900,156" fill="none" stroke="#9CA4AF" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="110,374 366,304 900,304" fill="none" stroke="#9CA4AF" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="110,96 366,166 900,166" fill="none" stroke={C.steelDark} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="110,364 366,294 900,294" fill="none" stroke={C.steelDark} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      {/* spike + centre body */}
      <polygon points="40,230 360,198 640,200 640,260 360,262" fill="#7A8290" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
      {/* air */}
      <g clipPath="url(#chan)">{parts}</g>
      {/* shock waves */}
      {shockP > 0 && (
        <g stroke={C.ink} strokeWidth="5" strokeDasharray="12 9" strokeLinecap="round" opacity={0.85}>
          <line x1="40" y1="230" x2={40 + 320 * shockP} y2={230 - 60 * shockP} />
          <line x1="40" y1="230" x2={40 + 320 * shockP} y2={230 + 60 * shockP} />
          {shockP > 0.9 && (
            <>
              <line x1="620" y1="170" x2="620" y2="200" />
              <line x1="620" y1="260" x2="620" y2="290" />
            </>
          )}
        </g>
      )}
      {glow > 0 && <ellipse cx="860" cy="230" rx={140 * glow + 20} ry={120 * glow + 20} fill="url(#hotglow)" opacity={glow} />}
      {/* compressor face */}
      <rect x="840" y="160" width="70" height="140" fill="#A5ADB8" stroke={C.ink} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <line key={k} x1="846" y1={182 + k * 22} x2="904" y2={182 + k * 22} stroke={C.ink} strokeWidth="3" />
      ))}
      {/* temperature probe */}
      <line x1="790" y1="166" x2="832" y2="228" stroke={C.ink} strokeWidth="6" strokeLinecap="round" />
      <circle cx="834" cy="230" r="11" fill={interpolateColors(probeP, [0, 1], [C.ink, C.red])} />
      {probeP > 0 && <circle cx="834" cy="230" r={pr} fill="none" stroke={C.red} strokeWidth="5" opacity={probeP} />}
    </svg>
  );
};
