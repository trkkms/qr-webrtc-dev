/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import Chapter from 'src/components/common/chapter';
import { useUpdateAtom } from 'jotai/utils';
import { guestStageAtom } from 'src/states/guest';

const Guest04TryConnect = () => {
  const updateStage = useUpdateAtom(guestStageAtom);
  console.log('here');
  useEffect(() => {
    updateStage(() => {
      return [{ stage: 5 }];
    });
  }, []);
  return (
    <Chapter title="4. 接続中">
      <p>接続中です...</p>
    </Chapter>
  );
};

export default Guest04TryConnect;
