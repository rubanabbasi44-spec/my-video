import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {Backdrop, FPS, Finish, H, TOTAL, VoiceOver, W} from './shared';
import {Part1} from './Part1';
import {Part2} from './Part2';

export const Main: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Part1 />
    <Part2 />
    <Finish />
    <VoiceOver />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition id="SR71" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
