/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react';
import jsQR, { QRCode } from 'jsqr';
import { useLogger } from 'src/states/app';

namespace QrScanner {
  export interface Props {
    onResult: (qr: QRCode) => void;
  }
}

const QrScanner = ({ onResult }: QrScanner.Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logger = useLogger();
  useEffect(() => {
    const f = async () => {
      const video = document.createElement('video');
      const canvas = canvasRef.current;
      if (canvas == null) {
        logger.error('Failed to get canvas element.');
        return;
      }
      const canvasContext = canvas.getContext('2d');
      if (canvasContext == null) {
        logger.error('Failed to get canvas context');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      video.srcObject = stream;
      video.volume = 0;
      await video.play();
      const scan = function _scan() {
        const canvas = canvasRef.current;
        if (canvas == null) {
          return;
        }
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (!code) {
          requestAnimationFrame(_scan);
          return;
        }
        onResult(code);
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      };
      requestAnimationFrame(scan);
      return stream;
    };
    const result = f().catch((e) => {
      logger.error(`Cannot get video stream: ${String(e)}`);
    });
    return () => {
      result.then((stream) => {
        if (stream) {
          stream.getTracks().forEach((track) => {
            if (track.readyState === 'live') {
              track.stop();
            }
          });
        }
      });
    };
  }, []);
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QrScanner;
