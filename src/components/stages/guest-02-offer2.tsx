/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { Guest02, guestStageAtom } from 'src/states/guest';
import { useUpdateAtom } from 'jotai/utils';
import { QRCode } from 'jsqr';
import { inflate } from 'wasm';
import { GuestService } from 'src/services/guest-service';
import QrScanner from 'src/components/common/qr-scanner';
import Chapter from 'src/components/common/chapter';
import BackNextButton from 'src/components/common/back-next-button';

namespace Guest02Offer2 {
  export interface Props {
    stage: Guest02;
    service: GuestService;
  }
}

const Guest02Offer2 = ({ stage, service }: Guest02Offer2.Props) => {
  const [offer, setOffer] = useState<string | undefined>(undefined);
  const updateStage = useUpdateAtom(guestStageAtom);
  const onResult = useCallback(async (code: QRCode) => {
    console.log('offer2 received:');
    console.log(code.binaryData);
    const sdp = inflate(new Uint8Array([...stage.halfOffer.slice(5), ...code.binaryData.slice(5)]));
    console.log(sdp);
    setOffer(sdp);
    if (sdp != undefined) {
      setOffer(sdp);
      const answer = await service.createAnswer(sdp);
      updateStage((prev) => {
        prev.push({ stage: 3, sdp: answer });
      });
    }
  }, []);
  const onBack = useCallback(() => {
    setOffer(undefined);
    updateStage((prev) => {
      prev.pop();
    });
  }, []);
  return (
    <Chapter title="2.オファー受信(後半)">
      {offer == null && <QrScanner onResult={onResult} />}
      <BackNextButton backTitle="戻る" onBack={onBack} />
    </Chapter>
  );
};

export default Guest02Offer2;
