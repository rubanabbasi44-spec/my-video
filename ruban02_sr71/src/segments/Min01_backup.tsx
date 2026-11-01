import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const HAS_VOICE = true;
const HAS_MUSIC = false;

type Scene = {text: string; sec: number; video?: string; hi?: string[]};

const SCENES: Scene[] = [
  {
    text: "How can a submarine navigate without GPS when every instrument it uses to track its position is slowly becoming wrong?",
    sec: 8,
    hi: ["GPS", "wrong"],
  },
  {
    text: "That is not a flaw in one machine. It is built into the physics of measuring motion without looking outside.",
    sec: 7,
    hi: ["physics"],
  },
  {
    text: "A tilt smaller than a tenth of a degree can put a submarine's calculated position kilometres from the truth in under an hour.",
    sec: 8,
    hi: ["tenth", "kilometres", "hour"],
  },
  {
    text: "So navigators do something that sounds impossible. They work with a system they know is drifting, and they manage the error instead of removing it.",
    sec: 8,
    hi: ["impossible", "drifting", "manage"],
  },
  {
    text: "To see why, start with what blocks the obvious answer. GPS satellites broadcast radio waves, and seawater is salty enough to conduct electricity.",
    sec: 9,
    hi: ["GPS", "seawater", "electricity"],
  },
  {
    text: "Inside seawater, the wave's electric field shoves charged ions back and forth, and that motion turns the signal's energy into heat.",
    sec: 8,
    hi: ["ions", "heat"],
  },
  {
    text: "Within a couple of centimetres, almost nothing of a GPS signal is left to detect.",
    sec: 6,
    hi: ["centimetres", "nothing"],
  },
  {
    text: "Active sonar could map the surroundings instead, but every ping tells anyone listening exactly where the submarine is.",
    sec: 6,
    hi: ["sonar", "ping"],
  },
];

const Words: React.FC<{text: string; frames: number; hi?: string[]}> = ({text, frames, hi = []}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const revealEnd = frames * 0.7;
  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 64,
        fontWeight: 700,
        lineHeight: 1.3,
        textAlign: "center",
        maxWidth: 1500,
      }}
    >
      {words.map((w, i) => {
        const start = (i / words.length) * revealEnd;
        const opacity = interpolate(frame, [start, start + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [start, start + 8], [20, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const clean = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
        const isHi = hi.some((h) => h.toLowerCase() === clean);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: 18,
              opacity,
              transform: "translateY(" + y + "px)",
              color: isHi ? "#ffb703" : "white",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const SceneView: React.FC<{scene: Scene; frames: number}> = ({scene, frames}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [frames - 10, frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{opacity: fade}}>
      {scene.video ? (
        <>
          <OffthreadVideo
            src={staticFile(scene.video)}
            muted
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
          <AbsoluteFill style={{backgroundColor: "rgba(0,0,0,0.45)"}} />
        </>
      ) : null}
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 140}}>
        <Words text={scene.text} frames={frames} hi={scene.hi} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Min01: React.FC = () => {
  const {fps} = useVideoConfig();
  let cursor = 0;
  return (
    <AbsoluteFill style={{background: "linear-gradient(180deg, #03111f 0%, #062a45 100%)"}}>
      {SCENES.map((s, i) => {
        const frames = Math.round(s.sec * fps);
        const from = cursor;
        cursor += frames;
        return (
          <Sequence key={i} from={from} durationInFrames={frames}>
            <SceneView scene={s} frames={frames} />
          </Sequence>
        );
      })}
      {HAS_VOICE ? <Audio src={staticFile("audio/voice/min01.mp3")} volume={1} /> : null}
      {HAS_MUSIC ? <Audio src={staticFile("audio/music/bg.mp3")} volume={0.12} /> : null}
    </AbsoluteFill>
  );
};
