/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { HostService, HostToGuestPeer } from 'src/services/host-service';
import { useTheme } from 'src/theme';
import Chapter from 'src/components/common/chapter';
import { useUpdateAtom } from 'jotai/utils';
import { hostStageAtom } from 'src/states/host';
import { useConnectionStateDetection } from 'src/common/hooks/util';

namespace Host05GuestList {
  export interface Props {
    service: HostService;
    setCurrentPeer: (peer: HostToGuestPeer) => void;
  }
}

interface PromisedTextProp {
  textP: Promise<string>;
}
const PromisedText = ({ textP }: PromisedTextProp) => {
  const [text, setText] = useState<string | undefined>(undefined);
  useEffect(() => {
    textP.then((text) => {
      setText(text);
    });
  }, []);
  return <>{text ?? ''}</>;
};

const Host05GuestList = ({ service, setCurrentPeer }: Host05GuestList.Props) => {
  const peers = service.getPeers();
  const [recordController, setRecordController] = useState<ReturnType<typeof service['startRecording']> | undefined>(
    undefined,
  );
  const updateStage = useUpdateAtom(hostStageAtom);
  useConnectionStateDetection();
  const { color } = useTheme();
  useEffect(() => {
    for (const peer of peers.values()) {
      if (peer.getConnectionState() !== 'connected') {
        peer.close();
      }
    }
  }, []);

  return (
    <Chapter title="ゲスト一覧">
      <div>
        {peers.size === 0 && <p css={css({ marginBottom: '5rem' })}>まだ接続はありません。</p>}
        <div css={css({ display: 'flex', justifyContent: 'center' })}>
          <button
            type="button"
            css={css({
              border: 'none',
              outline: 'none',
              padding: '0.5rem 1rem',
              background: color.primary.main,
            })}
            onClick={async () => {
              const peer = await service.createPeer();
              setCurrentPeer(peer);
              updateStage(() => [{ stage: 1, sdp: peer.sdp }]);
            }}
          >
            新規接続
          </button>
        </div>

        {peers.size > 0 && (
          <ol css={css({ display: 'flex', flexWrap: 'wrap', padding: '1rem', width: '100%' })}>
            {[...peers.values()].map((peer) => (
              <li css={css({ display: 'flex', justifyContent: 'space-between', width: '100%' })} key={peer.id}>
                <span css={css({ marginRight: '1rem' })}>{peer.id.slice(0, 6)}</span>
                <span css={css({ marginRight: '1rem' })}>
                  <PromisedText textP={peer.getName()} />
                </span>
                <span>{peer.getConnectionState()}</span>
                <button
                  type="button"
                  css={css({ border: 'none', outline: 'none', width: '2rem', background: color.secondary.dark })}
                  onClick={() => {
                    peer.close();
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div css={css({ display: 'flex', justifyContent: 'center', width: '100%' })}>
        <button
          type="button"
          css={css({
            border: 'none',
            outline: 'none',
            padding: '0.5rem 1rem',
            background: color.primary.main,
          })}
          onClick={() => {
            if (recordController == undefined) {
              const controller = service.startRecording();
              setRecordController(controller);
              return;
            }
            if (recordController.getRecordState() === 'paused') {
              recordController.resume();
              setRecordController({ ...recordController });
            }
            if (recordController.getRecordState() === 'recording') {
              recordController.pause();
              setRecordController({ ...recordController });
            }
          }}
        >
          {recordController ? '録音停止' : '録音開始'}
        </button>
        {recordController && (
          <button
            type="button"
            css={css({
              border: 'none',
              outline: 'none',
              padding: '0.5rem 1rem',
              background: color.primary.main,
            })}
            onClick={() => {
              recordController.clear();
              setRecordController(undefined);
            }}
          >
            クリア
          </button>
        )}
        {recordController && recordController.getRecordState() === 'paused' && (
          <button
            type="button"
            css={css({
              border: 'none',
              outline: 'none',
              padding: '0.5rem 1rem',
              background: color.primary.main,
            })}
            onClick={() => {
              recordController.save();
            }}
          >
            保存
          </button>
        )}
      </div>
    </Chapter>
  );
};

export default Host05GuestList;
