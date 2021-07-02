import React, { useEffect, useRef } from 'react';
import {
  useRecoilValue
} from 'recoil';
import frameSizeState from './state/atoms/frameSizeState';
import md5 from 'md5';
import styled from 'styled-components';

const StyledBackgroundTextLayerWrapperDiv = styled.div`
  position: absolute;
  user-select: none;
`;

export default function BackgroundTextLayer({ textList = [] }) {
  const canvasRef = useRef(null);
  const frameSize = useRecoilValue(frameSizeState);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Setup the font style
    ctx.fillStyle = 'black';
    ctx.font = `32px Impact, Charcoal, sans-serif`;

    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, frameSize.width, frameSize.height);

    // Iterate through the texts and paint them on
    textList.forEach(textData => {
      ctx.fillText(textData.text, textData.x, textData.y);
    });
  }, [textList, frameSize]);

  return (
    <StyledBackgroundTextLayerWrapperDiv>
      <canvas
        id={md5(JSON.stringify(textList.map(textData => textData.text)))}
        ref={canvasRef}
        height={frameSize.height}
        width={frameSize.width}
      />
    </StyledBackgroundTextLayerWrapperDiv>
  );
};