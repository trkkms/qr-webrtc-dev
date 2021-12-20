/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import { HostService } from 'src/services/host-service';
import { GuestService } from 'src/services/guest-service';
import { volumeAtom } from 'src/states/app';
import { useAtomValue } from 'jotai/utils';

namespace VolumeHandler {
  export interface Props {
    service: HostService | GuestService;
  }
}

const VolumeHandler = ({ service }: VolumeHandler.Props) => {
  const volumes = useAtomValue(volumeAtom);
  useEffect(() => {}, [volumes.mic.volume, volumes.mic.muted]);
  return <></>;
};

export default VolumeHandler;
