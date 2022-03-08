/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { Host04, hostStageAtom } from 'src/states/host';
import Chapter from 'src/components/common/chapter';
import { HostService, HostToGuestPeer } from 'src/services/host-service';
import { useLogger } from 'src/states/app';
import { useUpdateAtom } from 'jotai/utils';
import { AcceptGuest } from 'src/services/signal-service';

namespace Host04TryConnect {
  export interface Props {
    stage: Host04;
    peer: HostToGuestPeer;
    service: HostService;
  }
}

const Host04TryConnect = ({ stage, peer, service }: Host04TryConnect.Props) => {
  const logger = useLogger();
  const updateStage = useUpdateAtom(hostStageAtom);
  useEffect(() => {
    const f = async () => {
      await peer.connect(stage.sdp);
      const accept: AcceptGuest = {
        type: 'acceptGuest',
        guestId: peer.id,
        others: await Promise.all(
          Array.from(service.getPeers().values())
            .filter((other) => other.id !== peer.id)
            .map(async (peer) => ({
              id: peer.id,
              name: await peer.getName(),
            })),
        ),
      };
      await peer.sendMessage(accept);
      updateStage(() => {
        return [{ stage: 5 }];
      });
    };
    f().catch((e) => {
      logger.error(`Failed to receive answer: ${String(e)}`);
    });
  }, []);
  return (
    <Chapter title="5. 接続中">
      <p>接続中です...</p>
    </Chapter>
  );
};

export default Host04TryConnect;
