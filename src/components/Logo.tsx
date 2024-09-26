import React, { memo } from 'react';
import { SvgUri } from 'react-native-svg';

const Logo = ({
  isWhite,
  size = 'md',
}: {
  isWhite?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => (
  <SvgUri
    width="100%"
    height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
    uri={
      isWhite
        ? 'https://storage.googleapis.com/e-aluguel/aluguelapp/Logo-white.svg'
        : 'https://storage.googleapis.com/e-aluguel/aluguelapp/Logo1.svg'
    }
  />
);
export default memo(Logo);
