import React from 'react';
import { ImageSliderType } from '~/data/SliderData';
import { Text, View, Image } from 'react-native';

type Props = {
  item: ImageSliderType;
  index: number;
};
const SliderItem = ({ item, index }: Props) => {
  return (
    <View className="justify-center items-center">
      <View className="mb-6">
        <Image
          resizeMode="contain"
          width={320}
          height={320}
          source={{
            uri: item.image as string,
          }}
        />
      </View>
      <View className="space-y-4 w-80">
        <Text className="text-3xl text-center">{item.title}</Text>
        <Text className="text-base text-center">{item.description}</Text>
      </View>
    </View>
  );
};

export default SliderItem;
