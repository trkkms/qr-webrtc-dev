/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useTheme } from 'src/theme';

namespace BackNextButton {
  export interface Props {
    backTitle?: string;
    nextTitle?: string;
    onBack?: () => void;
    onNext?: () => void;
  }
}

const BackNextButton = ({ backTitle, nextTitle, onBack, onNext }: BackNextButton.Props) => {
  const { color } = useTheme();
  return (
    <ul
      css={css({
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        width: '100%',
        padding: '2rem',
        gap: '1rem',
        maxWidth: '400px',
      })}
    >
      {backTitle != null && (
        <li>
          <button
            type="button"
            css={css({
              width: '100%',
              height: '2rem',
              border: 'none',
              outline: 'none',
              background: color.primary.main,
            })}
            onClick={onBack}
          >
            {backTitle}
          </button>
        </li>
      )}
      {nextTitle && (
        <li css={css({ display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          <button
            type="button"
            css={css({
              width: '100%',
              height: '2rem',
              border: 'none',
              outline: 'none',
              background: color.primary.main,
            })}
            onClick={onNext}
          >
            {nextTitle}
          </button>
        </li>
      )}
    </ul>
  );
};

export default BackNextButton;
