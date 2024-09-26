import React, { useState } from 'react';
import { ImageSlider } from '~/data/SliderData';
import { Dimensions, View } from 'react-native';
import SliderItem from './SliderItem';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

const Slider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <View>
      <Carousel
        data={ImageSlider}
        renderItem={({ item, index }) => <SliderItem item={item} index={index} />}
        sliderWidth={screenWidth}
        itemWidth={screenWidth}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <View className="flex-row justify-center items-center mt-6">
        {ImageSlider.map((_, index) => (
          <View
            key={index}
            className={
              index === activeSlide
                ? 'w-4 h-2 bg-primary rounded-full mx-1'
                : 'w-2 h-2 bg-surfaceDisabled rounded-full mx-1'
            }
          />
        ))}
      </View>
    </View>
  );
};

export default Slider;
