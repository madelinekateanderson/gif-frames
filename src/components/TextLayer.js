import React, { useEffect, useState, useRef } from 'react';
import cloneDeep from 'lodash.clonedeep';

export default function TextLayer({ textLayerModel, onTextMove = () => { }, isLocked, showWarning }) {
  const canvasRef = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [layerData, setLayerData] = useState(textLayerModel);
  const [coord, setCoord] = useState({ x: -1, y: -1 });
  const [selectedTextIndex, setSelectedTextIndex] = useState(-1);
  const [canvasTextList, setCanvasTextList] = useState([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    // Setup the font style
    ctx.fillStyle = 'red';
    ctx.font = `${layerData.fontSize}px Impact, Charcoal, sans-serif`;

    // Clear canvas and repaint all the things
    ctx.clearRect(0, 0, layerData.width, layerData.height);

    const canvasTexts = layerData.textList.map(text => {
      return {
        ...text,
        height: layerData.fontSize,
        width: ctx.measureText(text.text).width
      };
    });

    // Iterate through the texts and paint them on
    canvasTexts.forEach((text, index) => {
      ctx.fillText(text.text, text.x, text.y);

      if (index === selectedTextIndex) {
        // Draw a border
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.rect(text.x - 5, text.y - text.height, text.width + 10, text.height + 10);
        ctx.stroke();
      }
    });

    setCanvasTextList(canvasTexts);
  }, [layerData, selectedTextIndex]);

  function isTextClicked(text, x, y) {
    return (
      x >= text.x
      && x <= (text.x + text.width)
      && (y >= text.y - text.height)
      && y <= text.y
    );
  }

  function onMouseDown(e) {
    if (!isLocked) {
      showWarning(true);
      return;
    }

    showWarning(false);
    setMouseDown(true);

    const pos = getMousePos(canvasRef.current, e);
    const index = canvasTextList.findIndex(text => isTextClicked(text, pos.x, pos.y));
    if (index >= 0) {
      setSelectedTextIndex(index);
      setCoord({
        x: pos.x,
        y: pos.y
      });
    }
  }

  function onMouseUp(e) {
    setMouseDown(false);
    setSelectedTextIndex(-1);
    setCoord({
      x: -1,
      y: -1
    });
  }

  function onMouseMove(e) {
    const pos = getMousePos(canvasRef.current, e);

    if (mouseDown && selectedTextIndex >= 0) {
      let layerDataClone = cloneDeep(layerData);

      const xChange = pos.x - coord.x;
      const yChange = pos.y - coord.y;

      layerDataClone.textList[selectedTextIndex].x += xChange;
      layerDataClone.textList[selectedTextIndex].y += yChange;

      setCoord({
        x: pos.x,
        y: pos.y
      });

      onTextMove({
        textLayerData: layerDataClone
      });

      setLayerData(layerDataClone);
    }

    const index = canvasTextList.findIndex(text => isTextClicked(text, pos.x, pos.y));
    if (index >= 0) {
      if (isLocked) {
        if (mouseDown) {
          canvasRef.current.style.cursor = 'grabbing';
        }
        else {
          canvasRef.current.style.cursor = 'grab';
        }
      }
    }
    else {
      canvasRef.current.style.cursor = 'default';
    }
  }

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  return (
    <canvas
      id={layerData.getHash()}
      ref={canvasRef}
      height={layerData.height}
      width={layerData.width}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className="js-frame-canvas m-auto"
    />
  );
};
