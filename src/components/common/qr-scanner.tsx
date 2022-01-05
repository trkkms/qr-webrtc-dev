/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import jsQR, { QRCode } from 'jsqr';
import { useLogger } from 'src/states/app';
import { css } from '@emotion/react';
import { getVideoStream } from 'src/common/media';
import { useTheme } from 'src/theme';

namespace QrScanner {
  export interface Props {
    onResult: (qr: QRCode) => void;
  }
}

const QrScanner = ({ onResult }: QrScanner.Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logger = useLogger();
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const { color } = useTheme();
  useEffect(() => {
    const f = async () => {
      if (!stream) {
        return;
      }
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
      video.srcObject = stream;
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
  }, [stream]);
  return (
    <div css={css({ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
      {stream && <canvas css={css({ width: '80%' })} ref={canvasRef} />}
      <video css={css({ display: 'none' })} ref={videoRef} />
      <button
        css={css({
          width: '100%',
          height: '2rem',
          border: 'none',
          outline: 'none',
          background: color.primary.main,
        })}
        onClick={() => {
          getVideoStream().then((stream) => {
            logger.info('stream acquired.');
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setStream(stream);
          });
        }}
      />
    </div>
  );
};

export default QrScanner;
