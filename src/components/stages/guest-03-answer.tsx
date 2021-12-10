/** @jsxImportSource @emotion/react */
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Guest03, guestStageAtom } from 'src/states/guest';
import { useUpdateAtom } from 'jotai/utils';
import Chapter from 'src/components/common/chapter';
import { useCompressedSDP } from 'src/common/hooks/compress';
import { useLogger } from 'src/states/app';
import QrGenerator from 'src/components/common/qr-generator';
import BackNextButton from 'src/components/common/back-next-button';
import { GuestService } from 'src/services/guest-service';

namespace Guest03Answer {
  export interface Props {
    stage: Guest03;
    service: GuestService;
  }
}

const Guest03Answer = ({ stage, service }: Guest03Answer.Props) => {
  const updateStage = useUpdateAtom(guestStageAtom);
  const [part, setPart] = useState<1 | 2>(1);
  const logger = useLogger();
  const title = part === 1 ? '3.アンサー(前半)' : '3.アンサー(後半)';
  const qrSrc = useCompressedSDP(stage.sdp, part, logger, [stage], [stage, part]);
  const onNext = useCallback(() => {
    if (part === 1) {
      setPart(2);
    }
  }, []);
  const onBack = useCallback(() => {
    if (part === 2) {
      setPart(1);
      return;
    }
    updateStage((prev) => {
      prev.pop();
      prev.pop();
    });
  }, []);
  useLayoutEffect(() => {
    service.setOnConnect(() => {
      updateStage((prev) => {
        prev.push({ stage: 4 });
      });
    });
  }, []);

  return (
    <Chapter title={title}>
      {qrSrc && (
        <div css={css({ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' })}>
          <QrGenerator src={qrSrc} cacheKey={`guest-answer-${part}`} />
        </div>
      )}
      <p css={css({ width: '100%', fontFamily: 'monospace', paddingLeft: '1rem' })}>
        <span>{`ホストにQRコードを${part === 2 ? 'もう一度' : ''}提示してください。`}</span>
      </p>
      <BackNextButton backTitle="戻る" nextTitle={part === 1 ? '次へ' : undefined} onNext={onNext} onBack={onBack} />
    </Chapter>
  );
};

export default Guest03Answer;
