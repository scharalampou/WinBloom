"use client";

import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

type ConfettiBurstProps = {
  recycle?: boolean;
  numberOfPieces?: number;
};

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  recycle = false,
  numberOfPieces = 500,
}) => {
  const { width, height } = useWindowSize();

  if (!width || !height) {
    return null;
  }

  return (
    <Confetti
      width={width}
      height={height}
      recycle={recycle}
      numberOfPieces={numberOfPieces}
      style={{ pointerEvents: 'none' }}
    />
  );
};
