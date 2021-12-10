import { useAtomValue } from 'jotai/utils';
import { modeAtom } from 'src/states/app';

interface ColorItem {
  main: string;
  dark: string;
  light: string;
}

type ColorItemWithText = ColorItem & { text: string };

interface Color {
  background: ColorItem;
  text: string;
  primary: ColorItemWithText;
  secondary: ColorItemWithText;
}

interface Theme {
  color: Color;
}

export const useTheme = (): Theme => {
  const mode = useAtomValue(modeAtom);
  const background = {
    main: '#282828',
    dark: '#000000',
    light: '#404040',
  };
  const host = {
    main: '#81d4fa',
    light: '#b6ffff',
    dark: '#4ba3c7',
    text: '#202020',
  };
  const guest = {
    main: '#ffee58',
    light: '#ffff8b',
    dark: '#c9bc1f',
    text: '#202020',
  };
  const text = '#E8E8E8';
  const color = {
    background,
    primary: mode === 'host' ? host : guest,
    secondary: mode === 'host' ? guest : host,
    text,
  };
  return {
    color,
  };
};
