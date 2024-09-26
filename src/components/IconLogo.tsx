import React, { memo } from 'react';
import { SvgUri } from 'react-native-svg';

const IconLogo = ({
  isWhite,
  size = 'md',
}: {
  isWhite?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => (
  <SvgUri
    width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
    height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
    uri={
      isWhite
        ? require('@assets/images/IconLogo-white.svg')
        : require('@assets/images/IconLogo.svg')
    }
  />
);
export default memo(IconLogo);
