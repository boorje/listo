import React from 'react';
import {Button} from 'react-native-elements';
import * as colors from '../../config/colors';

export default props => {
  const {title, type, onPress, disabled} = props;
  let buttonStyles = {height: 60};
  if (type === 'submit') {
    buttonStyles.backgroundColor = colors.submitColor;
  } else {
    buttonStyles.backgroundColor = colors.primaryColor;
  }
  return (
    <Button
      title={title}
      onPress={() => onPress()}
      disabled={disabled ? disabled : false}
      buttonStyle={buttonStyles}
      containerStyle={{margin: 20, height: 50}}
    />
  );
};
