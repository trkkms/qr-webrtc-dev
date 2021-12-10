/** @jsxImportSource @emotion/react */
import React from 'react';
import { HostService, HostToGuestPeer } from 'src/services/host-service';
import { hostStageAtom } from 'src/states/host';
import Host01Offer from 'src/components/stages/host-01-offer';
import { useAtomValue } from 'jotai/utils';
import Host02Answer1 from 'src/components/stages/host-02-answer1';
import Host03Answer2 from 'src/components/stages/host-03-answer2';
import Host04TryConnect from 'src/components/stages/host-04-try-connect';
import Host05GuestList from 'src/components/stages/host-05-guest-list';

namespace HostStages {
  export interface Props {
    service: HostService;
    peer: HostToGuestPeer;
  }
}

const HostStages = ({ service, peer }: HostStages.Props) => {
  const stages = useAtomValue(hostStageAtom);
  const current = stages[stages.length - 1];
  if (current == undefined) {
    return null;
  }
  if (current.stage === 1) {
    return <Host01Offer stage={current} />;
  }
  if (current.stage === 2) {
    return <Host02Answer1 />;
  }
  if (current.stage === 3) {
    return <Host03Answer2 stage={current} />;
  }
  if (current.stage === 4) {
    return <Host04TryConnect service={service} stage={current} peer={peer} />;
  }
  if (current.stage === 5) {
    return <Host05GuestList service={service} />;
  }
  return <></>;
};

export default HostStages;
