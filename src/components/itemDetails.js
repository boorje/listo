import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  InputAccessoryView,
  Keyboard,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

class ItemDetails extends React.Component {
  state = {
    content: '',
    isFocused: '',
    open: this.props.open,
  };

  render() {
    const inputID = 'inputID';
    const {isFocused} = this.state;

    return (
      <View>
        <TextInput
          ref={input => {
            this.firstTextInput = input;
          }}
          onFocus={() => {
            this.setState({isFocused: '1'});
          }}
          //style={styles.input}
          placeholder={'Vara'}
          placeholderTextColor={'black'}
          borderColor={'black'}
          returnKeyType="done"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          autoFocus={true}
          onSubmitEditing={() => {
            this.props.addItem(this.state.content);
          }}
          inputAccessoryViewID={inputID}
          onChangeText={text => {
            text.length === 0
              ? this.setState({content: text, open: false})
              : this.setState({content: text, open: true});
          }}
          value={this.state.content}
        />

        {this.props.open && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
            }}>
            <TextInput
              ref={input => {
                this.secondTextInput = input;
              }}
              onFocus={() => {
                this.setState({isFocused: '2'});
              }}
              //style={styles.input}
              placeholder={'Antal...'}
              placeholderTextColor={'black'}
              borderColor={'black'}
              returnKeyType="done"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              autoFocus={false}
              onSubmitEditing={() => {}}
              inputAccessoryViewID={inputID}
              onChangeText={() => {}}
              //value={this.state.content}
            />
            <TextInput
              ref={input => {
                this.thirdTextInput = input;
              }}
              onFocus={() => {
                this.setState({isFocused: '3'});
              }}
              //style={styles.input}
              placeholder={'Enhet...'}
              placeholderTextColor={'black'}
              borderColor={'black'}
              returnKeyType="done"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              autoFocus={false}
              onSubmitEditing={() => {}}
              inputAccessoryViewID={inputID}
              onChangeText={() => {}}
              //value={this.state.content}
            />
          </View>
        )}

        <InputAccessoryView
          nativeID={inputID}
          style={styles.InputAccessoryView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={styles.icons}>
              <Icon
                size={40}
                name={'navigate-before'}
                onPress={() => {
                  isFocused === '1' && this.props.open
                    ? this.thirdTextInput.focus()
                    : isFocused === '2'
                    ? this.firstTextInput.focus()
                    : this.props.open
                    ? this.secondTextInput.focus()
                    : null;
                }}
              />
              <Icon
                size={40}
                name={'navigate-next'}
                onPress={() => {
                  isFocused === '1'
                    ? this.secondTextInput.focus()
                    : isFocused === '2'
                    ? this.thirdTextInput.focus()
                    : this.firstTextInput.focus();
                }}
              />
            </View>
            <Icon
              size={30}
              name={'close'}
              onPress={() => {
                Keyboard.dismiss();
                this.props.closeDetails();
              }}
            />
          </View>
        </InputAccessoryView>
      </View>
    );
  }
}

export default ItemDetails;

const styles = StyleSheet.create({
  InputAccessoryView: {
    height: 40,
    paddingRight: 20,
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
  },
});
