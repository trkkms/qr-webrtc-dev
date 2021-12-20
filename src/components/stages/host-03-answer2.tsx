/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import Chapter from 'src/components/common/chapter';
import QrScanner from 'src/components/common/qr-scanner';
import { inflate } from 'wasm';
import BackNextButton from 'src/components/common/back-next-button';
import { useUpdateAtom } from 'jotai/utils';
import { Host03, hostStageAtom } from 'src/states/host';
import { QRCode } from 'jsqr';
import { cameraStreamAtom, useLogger } from 'src/states/app';
import { useAtom } from 'jotai';

namespace Host03Answer2 {
  export interface Props {
    stage: Host03;
  }
}

const Host03Answer2 = ({ stage }: Host03Answer2.Props) => {
  const [sdp, setSDP] = useState<string | undefined>(undefined);
  const updateStage = useUpdateAtom(hostStageAtom);
  const [cameraStream, setCameraStream] = useAtom(cameraStreamAtom);
  const logger = useLogger();
  const onResult = useCallback((code: QRCode) => {
    logger.info('answer2 received:');
    setCameraStream(undefined);
    const sdp = inflate(new Uint8Array([...stage.halfAnswer.slice(5), ...code.binaryData.slice(5)]));
    if (sdp != undefined) {
      setSDP(sdp);
      updateStage((prev) => {
        prev.push({ stage: 4, sdp });
      });
    } else {
      logger.error('Decoding SDP Failed');
    }
  }, []);
  const onBack = useCallback(() => {
    updateStage((prev) => {
      setSDP(undefined);
      prev.pop();
    });
  }, []);
  return (
    <Chapter title="3.アンサー受信(後半)">
      {sdp == null && cameraStream && <QrScanner onResult={onResult} stream={cameraStream} />}
      <BackNextButton backTitle="戻る" onBack={onBack} />
    </Chapter>
  );
};

export default Host03Answer2;
