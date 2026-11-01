import {Composition} from 'remotion';
import {Master, parts, MIN} from './Master';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Full" component={Master} durationInFrames={MIN * 10} fps={30} width={1920} height={1080} />
    {parts.map((P, i) => (
      <Composition
        key={i}
        id={`Min${String(i + 1).padStart(2, '0')}`}
        component={P}
        durationInFrames={MIN}
        fps={30}
        width={1920}
        height={1080}
      />
    ))}
  </>
);
