import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

// TODO: Add KeyboardNavigator. See beta project.
const ItemDetails = props => {
  return (
    <View>
      <TextInput
        ref={input => {
          this.firstTextInput = input;
        }}
        onFocus={() => {}}
        placeholder="Vara"
        //placeholder={this.props.placeholder}
        placeholderTextColor="black"
        returnKeyType="done"
        autoCorrect={false}
        enablesReturnKeyAutomatically={true}
        autoFocus={true}
        autoCapitalize="none"
        onSubmitEditing={() => {}}
      />
      <View style={{flexDirection: 'row'}}>
        <TextInput
          ref={input => {
            this.secondTextInput = input;
          }}
          onFocus={() => {}}
          placeholder="Antal..."
          placeholderTextColor="black"
          returnKeyType="done"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          autoFocus={true}
          autoCapitalize="none"
          onSubmitEditing={() => {}}
        />
        <TextInput
          ref={input => {
            this.thirdTextInput = input;
          }}
          onFocus={() => {}}
          placeholder="Enhet..."
          placeholderTextColor="black"
          returnKeyType="done"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          autoFocus={true}
          autoCapitalize="none"
          onSubmitEditing={() => {}}
        />
      </View>
    </View>
  );
};

export default ItemDetails;

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
