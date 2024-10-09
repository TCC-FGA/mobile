import React, { memo } from 'react';
import { SvgUri } from 'react-native-svg';
import IconLogoWhite from '@assets/images/IconLogo-white.svg';
import IconLogo from '@assets/images/IconLogo.svg';
import { StyleProp, View, ViewStyle } from 'react-native';

type LogoProps = {
  isWhite?: boolean;
  isIcon?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ViewStyle>;
};

const Logo = ({ isWhite, size = 'md', isIcon, style }: LogoProps) => {
  const renderLogo = () => {
    if (isWhite && isIcon) {
      return (
        <IconLogoWhite
          width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
        />
      );
    } else if (!isWhite && isIcon) {
      return (
        <IconLogo
          width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
          style={style ?? {}}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 52 : 64}
        />
      );
    } else {
      const logoUrl = isWhite
        ? 'https://storage.googleapis.com/e-aluguel/aluguelapp/Logo-white.svg'
        : 'https://storage.googleapis.com/e-aluguel/aluguelapp/Logo1.svg';

      return <SvgUri width="100%" height={getLogoSize(size)} uri={logoUrl} />;
    }
  };
  const getLogoSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    switch (size) {
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 52;
      default:
        return 64;
    }
  };

  return <View style={style}>{renderLogo()}</View>;
};
export default memo(Logo);
