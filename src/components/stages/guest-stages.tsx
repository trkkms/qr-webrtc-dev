/** @jsxImportSource @emotion/react */
import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { guestStageAtom } from 'src/states/guest';
import Guest01Offer1 from 'src/components/stages/guest-01-offer1';
import Guest02Offer2 from 'src/components/stages/guest-02-offer2';
import Guest03Answer from 'src/components/stages/guest-03-answer';
import Guest04TryConnect from 'src/components/stages/guest-04-try-connect';
import Guest05ConnectionList from 'src/components/stages/guest-05-connection-list';
import { GuestService } from 'src/services/guest-service';

namespace GuestStages {
  export interface Props {
    service: GuestService;
  }
}

const GuestStages = ({ service }: GuestStages.Props) => {
  const stages = useAtomValue(guestStageAtom);
  const current = stages[stages.length - 1];
  if (current == undefined) {
    return null;
  }
  if (current.stage === 1) {
    return <Guest01Offer1 />;
  }
  if (current.stage === 2) {
    return <Guest02Offer2 stage={current} service={service} />;
  }
  if (current.stage === 3) {
    return <Guest03Answer stage={current} service={service} />;
  }
  if (current.stage === 4) {
    return <Guest04TryConnect />;
  }
  if (current.stage === 5) {
    return <Guest05ConnectionList service={service} />;
  }
  return <></>;
};

export default GuestStages;
