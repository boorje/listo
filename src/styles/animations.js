import {LayoutAnimation} from 'react-native';

const animations = {
  default: {
    duration: 500,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 2,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 2,
    },
  },
};

export default animations;
