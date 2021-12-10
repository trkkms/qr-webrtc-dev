/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { LogItem } from 'src/states/app';

namespace Logs {
  export interface Props {
    items: LogItem[];
  }
}

const LogListItem = React.memo(function LogListItem({ item }: { item: LogItem }) {
  const { timestamp, level, message } = item;
  // HH:mm:ss
  const time = [timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds()]
    .map((t) => t.toString(10).padStart(2, '0'))
    .join(':');
  const text = `${time} [${level.toUpperCase()}] ${message}`;
  return (
    <li
      className={level}
      css={css({
        fontFamily: 'monospace',
        '&.info': {
          color: '#bdbdbd',
        },
        '&.warn': {
          color: '#ffa726',
        },
        '&.error': {
          color: '#ef5350',
        },
        '&.success': {
          color: '#29b6f6',
        },
      })}
    >
      {text}
    </li>
  );
});

const Logs = React.memo(function Logs({ items }: Logs.Props) {
  return (
    <ul css={css({ height: '100%', paddingLeft: '0.5rem' })}>
      {items.map((item) => (
        <LogListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

export default Logs;
