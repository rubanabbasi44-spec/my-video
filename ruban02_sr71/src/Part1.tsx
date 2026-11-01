import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame} from 'remotion';
import {
  Arrow,
  C,
  Check,
  Cross,
  Dial,
  FONT,
  InletDiagram,
  Jet,
  Layer,
  Line,
  Num,
  QMark,
  Reveal,
  Ring,
  Scene,
  Sfx,
  Snow,
  Tag,
  Thermo,
  VeoClip,
  Warn,
  easeIO,
  ip,
  mk,
  prog,
} from './shared';

/* ============================================================
   PART 1  —  0:00 to 0:36   (scenes 1-6)
   Every time below is an ABSOLUTE script time in seconds (from SRT).
   L(t) converts it into the scene's local frame.
   ============================================================ */

/* ---------- SCENE 1 · 0.00-6.16 · HOOK · VEO (jet) + Remotion (counter, arrow, wall) ---------- */
const Content1: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(0);
  const jx = 960 - 70 * prog(f, L(4.5), 24, easeIO); // jet gets "held back" at 4.5s
  const jy = 540 + Math.sin(f / 18) * 6;
  return (
    <AbsoluteFill>
      <Sfx at={L(0.3)} file="whoosh.mp3" />
      <VeoClip
        file="s01_jet_hero.mp4"
        fallback={
          <Reveal x={jx} y={jy} from="left" dist={1200} at={L(0.2)} dur={34}>
            <Jet width={900} />
          </Reveal>
        }
      />
      <Layer>
        <Arrow x1={380} y1={800} x2={1330} y2={800} at={L(3.0)} dur={22} color={C.green} width={18} />
        <Line x1={1560} y1={330} x2={1560} y2={790} at={L(4.3)} dur={16} color={C.red} width={10} dash="22 16" />
        <Ring x={1560} y={560} at={L(4.5)} color={C.red} />
      </Layer>
      {/* "Mach 3.3" */}
      <Reveal x={420} y={170} from="left" at={L(1.9)} dur={18}>
        <Num from={0} to={3.3} at={L(1.9)} dur={30} dec={1} prefix="MACH " size={96} />
      </Reveal>
      {/* "not a lack of thrust" */}
      <Reveal x={880} y={885} from="bottom" dist={120} at={L(3.3)}>
        <Tag text="THRUST" color={C.green} size={44} />
      </Reveal>
      <Reveal x={1450} y={800} at={L(3.9)} pop={0.5} dur={14}>
        <Check size={110} p={prog(f, L(3.9), 14)} />
      </Reveal>
      {/* the wall: something else is holding it back */}
      <Reveal x={1560} y={250} at={L(4.7)} pop={0.4} dur={14}>
        <QMark size={170} />
      </Reveal>
      <Sfx at={L(4.7)} file="hit.mp3" />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 2 · 6.16-12.54 · FLIGHT MANUAL · Remotion ---------- */
const Content2: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(6.16);
  const dimDial = 1 - 0.55 * prog(f, L(11.6), 12);
  const rows = [88, 72, 94, 60, 100, 80, 66, 90];
  return (
    <AbsoluteFill>
      <Sfx at={L(7.2)} file="paper.mp3" />
      {/* manual page */}
      <Reveal x={1330} y={560} from="bottom" dist={900} at={L(7.2)} dur={22}>
        <div
          style={{
            width: 640,
            height: 820,
            background: '#fff',
            border: `5px solid ${C.ink}`,
            borderRadius: 18,
            boxShadow: '0 30px 60px rgba(0,0,0,.22)',
            padding: 40,
            boxSizing: 'border-box',
            fontFamily: FONT,
          }}
        >
          <div
            style={{
              background: C.olive,
              color: '#fff',
              fontWeight: 800,
              fontSize: 36,
              padding: '16px 22px',
              borderRadius: 10,
              letterSpacing: 2,
            }}
          >
            SR-71 FLIGHT MANUAL
          </div>
          <div style={{marginTop: 30}}>
            {rows.map((w, i) => {
              const grow = prog(f, L(7.9 + i * 0.18), 14);
              const hl = i === 4 ? prog(f, L(11.1), 14) : 0;
              return (
                <div
                  key={i}
                  style={{
                    height: i === 4 ? 56 : 22,
                    margin: '24px 0',
                    width: `${w * grow}%`,
                    background: i === 4 ? interpolateColors(hl, [0, 1], ['#D5D9DE', C.orange]) : '#D5D9DE',
                    borderRadius: 8,
                  }}
                />
              );
            })}
          </div>
        </div>
      </Reveal>
      {/* "it is not a speed" */}
      <Reveal x={470} y={520} from="left" at={L(10.4)} dur={18}>
        <div style={{opacity: dimDial, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
          <Dial size={420} needle={0.92} />
          <Tag text="MACH 3.3" size={50} />
          <div style={{position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%,-50%)'}}>
            <Cross size={300} p={prog(f, L(11.2), 10)} />
          </div>
        </div>
      </Reveal>
      <Layer>
        <Ring x={1330} y={640} at={L(11.1)} color={C.orange} r0={30} r1={160} />
      </Layer>
    </AbsoluteFill>
  );
};

/* ---------- SCENE 3 · 12.54-19.90 · 427 DEGREES LIMIT · Remotion ---------- */
const Content3: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(12.54);
  const value = 380 * prog(f, L(15.2), 36, easeIO) + 47 * prog(f, L(18.0), 22, easeIO);
  const heat = Math.min(1, value / 427);
  return (
    <AbsoluteFill>
      <Layer>
        <Arrow x1={1350} y1={310} x2={760} y2={430} at={L(14.9)} dur={22} color={C.ink} width={8} dash="16 12" />
        <Ring x={620} y={540} at={L(16.6)} color={C.red} r0={40} r1={200} />
      </Layer>
      {/* mach tag = what is "allowed" */}
      <Reveal x={1350} y={250} from="right" at={L(12.7)} dur={18}>
        <Tag text="MACH 3.3" size={64} solid />
      </Reveal>
      <Reveal x={1640} y={250} at={L(13.5)} pop={0.4} dur={12}>
        <Check size={90} p={prog(f, L(13.5), 14)} />
      </Reveal>
      {/* thermometer = the one temperature */}
      <Reveal x={620} y={540} from="bottom" dist={500} at={L(14.4)} dur={22}>
        <Thermo value={value} min={0} max={500} limit={427} limitP={prog(f, L(16.6), 18)} showValue={false} />
      </Reveal>
      {/* 427 degrees */}
      <Reveal x={1350} y={560} from="right" at={L(17.9)} dur={16}>
        <Num from={0} to={427} at={L(17.9)} dur={30} prefix="≤ " suffix="°C" size={170} color={C.red} />
      </Reveal>
      {/* jet slowly heating as the reading climbs */}
      <Reveal x={1350} y={830} from="right" at={L(12.8)} dur={24}>
        <Jet width={520} heat={heat} />
      </Reveal>
      <Sfx at={L(16.6)} file="pulse.mp3" />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 4 · 19.90-25.56 · THE PROBE · Remotion ---------- */
const Content4: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(19.9);
  const cx = 1150;
  const cy = 560;
  const s = 1.35;
  const probe = ip(cx, cy, s, 834, 230);
  return (
    <AbsoluteFill>
      {/* thermometer carried over from scene 3 */}
      <Reveal x={230} y={540} at={L(19.9)} dur={8} pop={0.98}>
        <Thermo value={427} limit={427} limitP={1} showValue={false} scale={0.62} />
      </Reveal>
      <Reveal x={cx} y={cy} from="right" dist={700} at={L(20.1)} dur={24}>
        <InletDiagram scale={s} flowAt={L(20.6)} probeP={prog(f, L(20.8), 16)} />
      </Reveal>
      <Layer>
        <Line x1={probe.x} y1={probe.y - 40} x2={probe.x} y2={340} at={L(21.0)} dur={12} color={C.ink} width={6} />
        <Arrow x1={1450} y1={300} x2={370} y2={340} at={L(22.4)} dur={22} color={C.orange} width={9} dash="18 12" />
        <Ring x={probe.x} y={probe.y} at={L(22.4)} color={C.red} />
        <Ring x={probe.x + 40} y={probe.y} at={L(23.9)} color={C.blue} r1={150} />
      </Layer>
      <Reveal x={probe.x} y={300} from="top" dist={120} at={L(21.0)}>
        <Tag text="TEMP PROBE" color={C.red} size={40} />
      </Reveal>
      <Reveal x={1650} y={830} from="bottom" dist={100} at={L(23.9)}>
        <Tag text="COMPRESSOR" size={38} />
      </Reveal>
      <Sfx at={L(21.0)} file="click.mp3" />
    </AbsoluteFill>
  );
};

/* ---------- SCENE 5+6 · 25.56-36.18 · "STRANGE PART": 80,000 FT, -50 C vs LIMIT · Remotion ---------- */
const Content6: React.FC = () => {
  const f = useCurrentFrame();
  const L = mk(25.56);
  const climb = prog(f, L(27.5), 36, easeIO);
  const jetY = 900 - 576 * climb;
  const coldVal = 0 - 50 * prog(f, L(29.8), 40, easeIO);
  const ticks = [0, 20000, 40000, 60000, 80000, 100000];
  return (
    <AbsoluteFill>
      {/* "Here is the strange part" — pattern interrupt */}
      <Layer>
        <Ring x={960} y={540} at={L(25.7)} color={C.orange} r0={60} r1={320} dur={30} />
        <Ring x={960} y={540} at={L(26.1)} color={C.orange} r0={60} r1={320} dur={30} />
      </Layer>
      <Reveal x={960} y={540} at={L(25.7)} pop={0.4} dur={12} out={L(27.2)} to="top" outDur={14}>
        <Warn size={300} />
      </Reveal>
      <Sfx at={L(25.7)} file="alert.mp3" />

      {/* altitude ladder */}
      <Reveal x={250} y={540} from="left" dist={200} at={L(27.4)} dur={16}>
        <svg width={200} height={800} viewBox="0 0 200 800" style={{overflow: 'visible'}}>
          <line x1="100" y1="80" x2="100" y2="720" stroke={C.ink} strokeWidth="6" />
          {ticks.map((t) => {
            const y = 720 - (t / 100000) * 640;
            return (
              <g key={t}>
                <line x1="80" y1={y} x2="120" y2={y} stroke={C.ink} strokeWidth="5" />
                <text x="70" y={y + 9} textAnchor="end" fontFamily={FONT} fontSize="24" fontWeight="700" fill={C.mute}>
                  {t / 1000}k
                </text>
              </g>
            );
          })}
        </svg>
      </Reveal>
      <Reveal x={480} y={jetY} at={L(27.4)} dur={10}>
        <Jet width={170} rot={-90} />
      </Reveal>
      <Reveal x={760} y={324} from="left" dist={120} at={L(27.5)}>
        <Num from={0} to={80000} at={L(27.5)} dur={36} suffix=" FT" size={78} />
      </Reveal>

      {/* "about 50 degrees below zero" */}
      <Reveal x={1130} y={540} from="right" dist={500} at={L(29.4)} dur={20}>
        <Thermo value={coldVal} min={-100} max={500} showValue scale={0.95} />
      </Reveal>
      <Reveal x={1130} y={130} from="top" dist={100} at={L(29.6)}>
        <Tag text="OUTSIDE AIR" color={C.blue} size={40} />
      </Reveal>
      <Reveal x={1380} y={420} at={L(30.6)} pop={0.4} dur={14}>
        <Snow size={170} />
      </Reveal>

      {/* "So where does a heat limit come from?" */}
      <Reveal x={1600} y={540} from="right" dist={500} at={L(32.7)} dur={20}>
        <Thermo value={427} min={-100} max={500} limit={427} limitP={prog(f, L(33.2), 16)} showValue={false} scale={0.95} pulse />
      </Reveal>
      <Reveal x={1600} y={130} from="top" dist={100} at={L(32.9)}>
        <Tag text="LIMIT" color={C.red} size={40} />
      </Reveal>
      <Layer>
        <Arrow x1={1290} y1={560} x2={1470} y2={560} at={L(33.4)} dur={18} color={C.ink} width={8} dash="16 12" />
        <Ring x={1370} y={430} at={L(34.8)} color={C.red} r0={30} r1={150} />
      </Layer>
      <Reveal x={1370} y={430} at={L(34.8)} pop={0.4} dur={14}>
        <QMark size={190} />
      </Reveal>
    </AbsoluteFill>
  );
};

export const Part1: React.FC = () => (
  <>
    <Scene a={0} b={6.16}>
      <Content1 />
    </Scene>
    <Scene a={6.16} b={12.54}>
      <Content2 />
    </Scene>
    <Scene a={12.54} b={19.9}>
      <Content3 />
    </Scene>
    <Scene a={19.9} b={25.56}>
      <Content4 />
    </Scene>
    <Scene a={25.56} b={36.18}>
      <Content6 />
    </Scene>
  </>
);

