import {Series} from 'remotion';
import {Min01} from './segments/Min01';
import {Min02} from './segments/Min02';
import {Min03} from './segments/Min03';
import {Min04} from './segments/Min04';
import {Min05} from './segments/Min05';
import {Min06} from './segments/Min06';
import {Min07} from './segments/Min07';
import {Min08} from './segments/Min08';
import {Min09} from './segments/Min09';
import {Min10} from './segments/Min10';

export const MIN = 1800;
export const parts = [Min01, Min02, Min03, Min04, Min05, Min06, Min07, Min08, Min09, Min10];

export const Master: React.FC = () => (
  <Series>
    {parts.map((P, i) => (
      <Series.Sequence key={i} durationInFrames={1} trimBefore={1799}>
        <P />
      </Series.Sequence>
    ))}
  </Series>
);
