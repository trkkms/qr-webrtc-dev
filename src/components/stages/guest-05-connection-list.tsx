/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { GuestService } from 'src/services/guest-service';
import { useConnectionStateDetection } from 'src/common/hooks/util';
import Chapter from 'src/components/common/chapter';
import VolumeUnlock from 'src/components/common/navigations/volume-unlock';

namespace Guest05ConnectionList {
  export interface Props {
    service: GuestService;
  }
}

const Guest05ConnectionList = ({ service }: Guest05ConnectionList.Props) => {
  const peers = service.signalService.peers;
  useConnectionStateDetection();
  return (
    <Chapter title="接続一覧">
      <ol>
        <li>ホスト</li>
        {Array.from(peers.values()).map((peer) => (
          <li key={peer.id}>{`${peer.id.slice(0, 6)} ${peer.name}`}</li>
        ))}
      </ol>
      <VolumeUnlock />
    </Chapter>
  );
};

export default Guest05ConnectionList;
