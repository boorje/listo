import React from 'react';
import {Text} from 'react-native';

const AppText = props => {
  return (
    <Text style={{fontSize: 20, fontFamily: 'Avenir Next'}}>
      {props.children}
    </Text>
  );
};

export default AppText;
