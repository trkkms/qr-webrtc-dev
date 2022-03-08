/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { guestStageAtom } from 'src/states/guest';
import { QRCode } from 'jsqr';
import Chapter from 'src/components/common/chapter';
import QrScanner from 'src/components/common/qr-scanner';
import BackNextButton from 'src/components/common/back-next-button';

import { useLogger } from 'src/states/app';
import StepBar from 'src/components/common/navigations/step-bar';
import { HostTitles } from 'src/components/stages/host-stages';
import { GuestTitles } from 'src/services/guest-service';

const Guest01Offer1 = () => {
  const [halfSDP, setHalfSDP] = useState<number[] | undefined>(undefined);
  const updateStage = useUpdateAtom(guestStageAtom);
  const logger = useLogger();
  const onResult = useCallback(async (code: QRCode) => {
    logger.info('offer1 received:');
    setHalfSDP(code.binaryData);
  }, []);
  const onNext = useCallback(async () => {
    if (halfSDP == null) {
      return;
    }
    updateStage((prev) => {
      prev.push({ stage: 2, halfOffer: halfSDP });
    });
  }, [halfSDP]);
  return (
    <>
      <StepBar count={0} titles={GuestTitles} />
      <Chapter title="1.オファー受信(前半)">
        {halfSDP == null && <QrScanner onResult={onResult} />}
        {halfSDP && <BackNextButton nextTitle="次へ" onNext={onNext} />}
      </Chapter>
    </>
  );
};

export default Guest01Offer1;
