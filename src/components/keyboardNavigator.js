import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  InputAccessoryView,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const KeyboardNavigator = props => {
  const inputId = props.inputId;
  return (
    <InputAccessoryView nativeID={inputId} style={styles.InputAccessoryView}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={styles.icons}>
          <Icon
            size={40}
            name={'navigate-before'}
            color="black"
            onPress={() => {
              props.isFocused === '1' && props.open
                ? this.thirdTextInput.focus()
                : props.isFocused === '2'
                ? this.firstTextInput.focus()
                : props.open
                ? this.secondTextInput.focus()
                : null;
            }}
          />
          <Icon
            size={40}
            name={'navigate-next'}
            color="black"
            onPress={() => {
              props.isFocused === '1' && props.open
                ? this.secondTextInput.focus()
                : props.isFocused === '2'
                ? this.thirdTextInput.focus()
                : this.firstTextInput.focus();
            }}
          />
        </View>
        <Icon
          size={30}
          name={'close'}
          color="black"
          onPress={() => {
            Keyboard.dismiss();
          }}
        />
      </View>
    </InputAccessoryView>
  );
};

export default KeyboardNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    marginTop: '3%',
  },
});
