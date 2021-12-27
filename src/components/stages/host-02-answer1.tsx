/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { HostToGuestPeer } from 'src/services/host-service';
import Chapter from 'src/components/common/chapter';
import QrScanner from 'src/components/common/qr-scanner';
import BackNextButton from 'src/components/common/back-next-button';
import { hostStageAtom } from 'src/states/host';
import { cameraStreamAtom, useLogger } from 'src/states/app';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { getVideoStream } from 'src/common/media';

namespace Host02Answer1 {
  export interface Props {
    peer: HostToGuestPeer;
  }
}

const Host02Answer1 = () => {
  const [halfSDP, setHalfSDP] = useState<number[] | undefined>(undefined);
  const updateStage = useUpdateAtom(hostStageAtom);
  const logger = useLogger();
  const onResult = useCallback((code) => {
    logger.info('answer1 received:');
    setHalfSDP(code.binaryData);
  }, []);
  const onBack = useCallback(() => {
    updateStage((prev) => {
      prev.pop();
    });
  }, []);
  const onNext = useCallback(async () => {
    if (halfSDP == null) {
      return;
    }
    updateStage((prev) => {
      prev.push({ stage: 3, halfAnswer: halfSDP });
    });
  }, [halfSDP]);
  return (
    <Chapter title="2.アンサー受信(前半)">
      {halfSDP == null && <QrScanner onResult={onResult} />}
      <BackNextButton
        backTitle="戻る"
        onBack={onBack}
        nextTitle={halfSDP != null ? '次へ' : undefined}
        onNext={onNext}
      />
    </Chapter>
  );
};

export default Host02Answer1;
