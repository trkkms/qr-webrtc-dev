/** @jsxImportSource @emotion/react */
import React, { useCallback, useState } from 'react';
import { css } from '@emotion/react';
import { Host01, hostStageAtom } from 'src/states/host';
import { useUpdateAtom } from 'jotai/utils';
import QrGenerator from 'src/components/common/qr-generator';
import BackNextButton from 'src/components/common/back-next-button';
import Chapter from 'src/components/common/chapter';
import { cameraStreamAtom, useLogger } from 'src/states/app';
import { useCompressedSDP } from 'src/common/hooks/compress';
import { getVideoStream } from 'src/common/media';

namespace Host0102Offer {
  export interface Props {
    stage: Host01;
  }
}

const Host01Offer = React.memo(function Host01({ stage }: Host0102Offer.Props) {
  const updateStage = useUpdateAtom(hostStageAtom);
  const [part, setPart] = useState<1 | 2>(1);
  const logger = useLogger();
  const onBack = useCallback(() => {
    if (part === 2) {
      setPart(1);
    } else {
      updateStage(() => [{ stage: 5 }]);
    }
  }, [part]);
  const onNext = useCallback(async () => {
    if (part === 1) {
      setPart(2);
    } else {
      updateStage((prev) => {
        prev.push({ stage: 2 });
      });
    }
  }, [part]);
  const title = part === 1 ? '1.オファー(前半)' : '1.オファー(後半)';
  const qrSrc = useCompressedSDP(stage.sdp, part, logger, [stage], [stage, part]);
  return (
    <Chapter title={title}>
      {qrSrc && (
        <div css={css({ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' })}>
          <QrGenerator src={qrSrc} cacheKey={`host-offer-${part}`} />
        </div>
      )}
      <p css={css({ width: '100%', fontFamily: 'monospace', paddingLeft: '1rem' })}>
        <span>接続するゲストに提示してください。</span>
      </p>

      {part === 2 && (
        <p css={css({ width: '100%', fontFamily: 'monospace', paddingLeft: '1rem' })}>
          「次へ」を押すとカメラが起動します。
        </p>
      )}

      <BackNextButton backTitle={part === 2 ? '戻る' : 'ゲスト一覧'} nextTitle="次へ" onBack={onBack} onNext={onNext} />
    </Chapter>
  );
});

export default Host01Offer;
