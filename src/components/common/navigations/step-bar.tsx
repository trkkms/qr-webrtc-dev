/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { useTheme } from 'src/theme';
import classNames from 'classnames';

namespace StepBar {
  export type Props = {
    count: number;
    titles: string[];
  };
}

const StepBar = ({ count, titles }: StepBar.Props) => {
  const theme = useTheme();
  return (
    <>
      <ol
        css={css({
          listStyleType: 'none',
          position: 'relative',
          margin: '20px 0 0',
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          '& > li': {
            position: 'relative',
            textAlign: 'center',
            width: '24%',
            color: '#B0B0B0',
            fontWeight: 'bold',
            counterIncrement: 'steps',
            fontSize: 'small',
          },
          '& > li:before': {
            display: 'block',
            width: '26px',
            height: '26px',
            margin: '7px auto 20px auto',
            lineHeight: '26px',
            fontSize: '12px',
            textAlign: 'center',
            borderRadius: '50%',
            backgroundColor: '#808080',
            content: 'counter(steps)',
          },
          '& > li:after': {
            position: 'absolute',
            zIndex: -1,
            top: '15px',
            left: '-50%',
            width: '100%',
            height: '2px',
            content: '""',
            backgroundColor: '#808080',
          },
          '& > li:first-of-type:after': {
            content: 'none',
          },
          '& > li.active:before': {
            backgroundColor: theme.color.primary.main,
            color: theme.color.primary.text,
          },
          '& > li.complete:before': {
            backgroundColor: theme.color.primary.main,
            color: theme.color.primary.text,
          },
          '& > li.active:after': {
            backgroundColor: theme.color.primary.main,
          },
          '& > li.complete:after': {
            backgroundColor: theme.color.primary.main,
          },
        })}
      >
        {titles.map((title, idx) => {
          const complete = idx < count;
          const active = idx === count;
          return (
            <li
              key={title}
              className={classNames({
                active,
                complete,
              })}
            >
              {title}
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default StepBar;
