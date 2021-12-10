/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { guestStageAtom } from 'src/states/guest';
import { QRCode } from 'jsqr';
import Chapter from 'src/components/common/chapter';
import QrScanner from 'src/components/common/qr-scanner';
import BackNextButton from 'src/components/common/back-next-button';

const Guest01Offer1 = () => {
  const [halfSDP, setHalfSDP] = useState<number[] | undefined>(undefined);
  const updateStage = useUpdateAtom(guestStageAtom);
  const onResult = useCallback((code: QRCode) => {
    console.log('offer1 received:');
    console.log(code.binaryData);
    setHalfSDP(code.binaryData);
  }, []);
  const onNext = useCallback(() => {
    if (halfSDP == null) {
      return;
    }
    updateStage((prev) => {
      prev.push({ stage: 2, halfOffer: halfSDP });
    });
  }, [halfSDP]);
  return (
    <Chapter title="1.オファー受信(前半)">
      {halfSDP == null && <QrScanner onResult={onResult} />}
      {halfSDP && <BackNextButton nextTitle="次へ" onNext={onNext} />}
    </Chapter>
  );
};

export default Guest01Offer1;
