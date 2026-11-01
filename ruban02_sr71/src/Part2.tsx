import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  Arrow,
  C,
  Check,
  Cross,
  Dial,
  FONT,
  Flame,
  InletDiagram,
  Jet,
  Layer,
  Line,
  Num,
  Reveal,
  Ring,
  Scene,
  Sfx,
  SpeedIcon,
  Streaks,
  Snow,
  Tag,
  Thermo,
  VeoClip,
  Waves,
  easeIO,
  mk,
  prog,
} from './shared';

/* ============================================================
   PART 2  —  0:36 to 1:12   (scenes 7-12)
   ============================================================ */

/* ---------- SCENE 7 · 36.18-42.98 · SPEED ITSELF · VEO (jet at speed) + Remotion (counter) ---------- */
const Content7: React.FC = () => {
  const L = mk(36.18);
  return (
    <AbsoluteFill>
      <Layer>
        <Streaks speed={60} y0={230} y1={880} len={280} color={C.blue} opacity={0.5} at={L(38.8)} />
        <Arrow x1={1180} y1={560} x2={1560} y2={560} at={L(37.0)} dur={18} color={C.orange} width={16} />
      </Layer>
      <VeoClip
        file="s07_jet_speed.mp4"
        fallback={
          <Reveal x={780} y={560} from="left" dist={1000} at={L(36.3)} dur={30}>
            <Jet width={760} />
          </Reveal>
        }
      />
      {/* "it comes from the speed itself" */}
      <Reveal x={1500} y={250} from="top" dist={200} at={L(36.6)} dur={18}>
        <Dial size={360} needle={0.9} />
      </Reveal>
      <Reveal x={1370} y={650} from="bottom" dist={100} at={L(37.2)}>
        <Tag text="SPEED" color={C.orange} size={44} solid />
      </Reveal>
      {/* "more than 2,000 miles per hour" */}
      <Reveal x={1500} y={440} from="right" dist={160} at={L(39.2)} dur={16}>
        <Num from={0} to={2000} at={L(39.2)} dur={60} prefix="> " suffix=" MPH" size={84} />
      </Reveal>
      <Layer>
        <Ring x={1500} y={250} at={L(41.4)} color={C.orange} r0={60} r1={210} />
      </Layer>
      <Sfx at={L(36.4)} file="whoosh.mp3" />
      <Sfx at={L(38.8)} file="wind.mp3" volume={0.35} />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 8 · 42.98-48.48 · SLOW THE AIR DOWN · Remotion ---------- */
const Content8: React.FC = () => {
  const L = mk(42.98);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Reveal x={960} y={600} from="bottom" dist={400} at={L(43.1)} dur={22}>
        <InletDiagram scale={1.5} flowAt={L(43.6)} hot={prog(f, L(46.6), 40) * 0.5} />
      </Reveal>
      <Layer>
        <Arrow x1={260} y1={320} x2={780} y2={320} at={L(43.4)} dur={22} color={C.blue} width={16} />
        <Arrow x1={1320} y1={320} x2={1480} y2={320} at={L(44.9)} dur={14} color={C.blue} width={16} />
        <Ring x={1580} y={820} at={L(46.5)} color={C.orange} r0={40} r1={160} />
      </Layer>
      <Reveal x={520} y={250} from="top" dist={100} at={L(43.6)}>
        <Tag text="FAST" color={C.blue} size={40} />
      </Reveal>
      <Reveal x={1400} y={250} from="top" dist={100} at={L(45.0)}>
        <Tag text="SLOW" color={C.blue} size={40} />
      </Reveal>
      {/* "slowing it has a cost" */}
      <Reveal x={1580} y={820} at={L(46.5)} pop={0.4} dur={14}>
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 95,
            background: '#fff',
            border: `6px solid ${C.ink}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 30px rgba(0,0,0,.18)',
          }}
        >
          <Flame size={110} />
        </div>
      </Reveal>
      <Sfx at={L(46.5)} file="coin.mp3" />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 9 · 48.48-53.92 · MOTION BECOMES HEAT · VEO (3D inlet heating) + Remotion (icons) ---------- */
const Content9: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(48.48);
  const motionOp = 1 - 0.7 * prog(f, L(49.2), 12) + 0.7 * prog(f, L(50.0), 12);
  const heatP = prog(f, L(52.6), 50, easeIO);
  return (
    <AbsoluteFill>
      <VeoClip
        file="s09_inlet_heat.mp4"
        fallback={
          <Reveal x={1000} y={640} at={L(48.5)} dur={14}>
            <InletDiagram scale={1.35} flowAt={L(48.6)} hot={heatP} glow={prog(f, L(52.8), 50, easeIO)} />
          </Reveal>
        }
      />
      {/* motion icon */}
      <Reveal x={330} y={260} from="left" at={L(48.6)} dur={16}>
        <div style={{opacity: motionOp}}>
          <SpeedIcon size={230} />
        </div>
      </Reveal>
      <Layer>
        <Arrow x1={480} y1={260} x2={1500} y2={260} at={L(50.9)} dur={40} color={C.orange} width={14} />
        <Ring x={1650} y={260} at={L(52.7)} color={C.red} r0={50} r1={190} />
      </Layer>
      {/* heat icon */}
      <Reveal x={1650} y={260} from="right" dist={200} at={L(51.0)} dur={18}>
        <Waves size={170} color={heatP > 0.3 ? C.red : C.orange} />
      </Reveal>
      <Reveal x={1000} y={130} from="top" dist={80} at={L(51.2)}>
        <Tag text="ENERGY" size={38} />
      </Reveal>
      <Sfx at={L(52.7)} file="heat.mp3" />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 10 · 53.92-61.34 · TOTAL TEMPERATURE GRAPH · Remotion (graph animation) ---------- */
const X0 = 420;
const X1 = 1500;
const Y0 = 900; // bottom
const Y1 = 180; // top
const gx = (m: number) => X0 + (m / 4) * (X1 - X0);
const gy = (t: number) => Y0 - ((t + 100) / 800) * (Y0 - Y1);
// total temperature (C) for static air at 220.3 K (about -53 C) : T0 = Ts * (1 + 0.2 M^2)
const totalT = (m: number) => 220.3 * (1 + 0.2 * m * m) - 273.15;

const Content10: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(53.92);
  const p = prog(f, L(55.8), 91, easeIO); // 55.8s -> 59.6s
  const maxM = 4 * p;
  let d = '';
  for (let i = 0; i <= 80; i++) {
    const m = (i / 80) * 4;
    d += `${i === 0 ? 'M' : 'L'}${gx(m).toFixed(1)} ${gy(totalT(m)).toFixed(1)} `;
  }
  const headM = Math.min(maxM, 4);
  const hx = gx(headM);
  const hy = gy(totalT(headM));
  const limitY = gy(427);
  const atLimit = prog(f, L(58.8), 16);
  const dotP = prog(f, L(59.0), 12);
  return (
    <AbsoluteFill>
      <Layer>
        {/* axes */}
        <Line x1={X0} y1={Y0} x2={X1} y2={Y0} at={L(54.1)} dur={20} width={7} />
        <Line x1={X0} y1={Y0} x2={X0} y2={Y1} at={L(54.1)} dur={20} width={7} />
        <line x1={X0} y1={gy(0)} x2={X1} y2={gy(0)} stroke={C.line} strokeWidth="3" strokeDasharray="8 8" opacity={prog(f, L(54.8), 10)} />
        {[1, 2, 3, 4].map((m) => (
          <text key={m} x={gx(m)} y={Y0 + 44} textAnchor="middle" fontFamily={FONT} fontSize="30" fontWeight="700" fill={C.mute} opacity={prog(f, L(54.6), 12)}>
            {m}
          </text>
        ))}
        {/* curve */}
        <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} fill="none" stroke={C.orange} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        {/* limit + drop line */}
        <line x1={X0} y1={limitY} x2={X0 + (X1 - X0) * atLimit} y2={limitY} stroke={C.red} strokeWidth="6" strokeDasharray="16 10" />
        <line x1={gx(3.3)} y1={limitY} x2={gx(3.3)} y2={limitY + (Y0 - limitY) * atLimit} stroke={C.red} strokeWidth="5" strokeDasharray="10 8" />
        {/* leading dot */}
        {p > 0 && p < 1 && <circle cx={hx} cy={hy} r="14" fill={C.red} stroke="#fff" strokeWidth="4" />}
        {dotP > 0 && <circle cx={gx(3.3)} cy={limitY} r={16 + 4 * dotP} fill={C.red} stroke="#fff" strokeWidth="5" />}
        <Ring x={gx(3.3)} y={limitY} at={L(59.0)} color={C.red} r0={20} r1={120} />
      </Layer>
      {/* "total temperature" */}
      <Reveal x={X0 + 130} y={110} from="top" dist={120} at={L(55.4)}>
        <Tag text="TOTAL TEMPERATURE" color={C.red} size={40} />
      </Reveal>
      {/* "set by one thing: how fast the air was moving" */}
      <Reveal x={960} y={985} from="bottom" dist={100} at={L(57.5)}>
        <Tag text="AIR SPEED" size={40} solid />
      </Reveal>
      <Reveal x={gx(3.3)} y={Y0 + 110} from="bottom" dist={60} at={L(59.0)}>
        <Tag text="MACH 3.3" color={C.orange} size={36} />
      </Reveal>
      <Reveal x={X1 + 150} y={limitY} from="right" dist={100} at={L(58.9)}>
        <Num from={0} to={427} at={L(58.9)} dur={14} suffix="°C" size={70} color={C.red} />
      </Reveal>
      <Sfx at={L(55.8)} file="draw.mp3" volume={0.4} />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 11 · 61.34-65.68 · CAN THE INLET COOL IT? NO · Remotion ---------- */
const Content11: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(61.34);
  const fade = 1 - prog(f, L(64.4), 10);
  return (
    <AbsoluteFill>
      <Reveal x={960} y={640} at={L(61.4)} dur={14}>
        <InletDiagram scale={1.4} flowAt={L(61.5)} hot={prog(f, L(64.5), 30)} />
      </Reveal>
      {/* "you might think the inlet could cool the air" */}
      <Reveal x={960} y={290} at={L(62.0)} pop={0.4} dur={14}>
        <div style={{position: 'relative', width: 220, height: 220, opacity: 1}}>
          <div style={{opacity: 1}}>
            <Snow size={220} />
          </div>
          <div style={{position: 'absolute', left: 0, top: 0}}>
            <Cross size={220} p={prog(f, L(64.44), 8)} />
          </div>
        </div>
      </Reveal>
      <Layer>
        <g opacity={fade}>
          <Arrow x1={1100} y1={400} x2={1100} y2={500} at={L(62.6)} dur={14} color={C.blue} width={12} />
          <Arrow x1={1250} y1={400} x2={1250} y2={500} at={L(62.8)} dur={14} color={C.blue} width={12} />
          <Arrow x1={1400} y1={400} x2={1400} y2={500} at={L(63.0)} dur={14} color={C.blue} width={12} />
        </g>
      </Layer>
      <Sfx at={L(64.44)} file="buzzer.mp3" />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 12 · 65.68-72.04 · SHOCK WAVES: NO HEAT ADDED · VEO (3D shocks) + Remotion (icons) ---------- */
const Content12: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(65.68);
  return (
    <AbsoluteFill>
      <VeoClip
        file="s12_shockwaves.mp4"
        fallback={
          <Reveal x={900} y={600} at={L(65.7)} dur={14}>
            <InletDiagram scale={1.5} flowAt={L(65.8)} shockP={prog(f, L(65.9), 30)} hot={0.3} />
          </Reveal>
        }
      />
      <Layer>
        {/* "compress it" */}
        <Arrow x1={1180} y1={390} x2={1180} y2={470} at={L(68.9)} dur={12} color={C.ink} width={12} />
        <Arrow x1={1180} y1={810} x2={1180} y2={730} at={L(68.9)} dur={12} color={C.ink} width={12} />
        <Ring x={1740} y={540} at={L(71.0)} color={C.green} r0={40} r1={160} />
      </Layer>
      {/* "add no heat, remove none" -> total temperature unchanged */}
      <Reveal x={1740} y={540} from="right" dist={300} at={L(69.9)} dur={18}>
        <Thermo value={300} limit={undefined} showValue={false} scale={0.62} />
      </Reveal>
      <Reveal x={1740} y={210} from="top" dist={100} at={L(70.2)}>
        <Tag text="ΔT = 0" color={C.green} size={56} />
      </Reveal>
      <Reveal x={1740} y={880} at={L(71.1)} pop={0.4} dur={12}>
        <Check size={100} p={prog(f, L(71.1), 14)} />
      </Reveal>
      <Sfx at={L(65.9)} file="crack.mp3" />
    </AbsoluteFill>
  );
};

export const Part2: React.FC = () => (
  <>
    <Scene a={36.18} b={42.98}>
      <Content7 />
    </Scene>
    <Scene a={42.98} b={48.48}>
      <Content8 />
    </Scene>
    <Scene a={48.48} b={53.92}>
      <Content9 />
    </Scene>
    <Scene a={53.92} b={61.34}>
      <Content10 />
    </Scene>
    <Scene a={61.34} b={65.68}>
      <Content11 />
    </Scene>
    <Scene a={65.68} b={72.04}>
      <Content12 />
    </Scene>
  </>
);

