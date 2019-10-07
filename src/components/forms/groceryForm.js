import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  InputAccessoryView,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../../styles/textStyles';

export default class GroceryForm extends React.Component {
  state = {
    content: this.props.content || '',
    quantity: this.props.quantity || '',
    unit: this.props.unit || '',
    isFocused: '',
  };

  render() {
    const inputID = 'inputID';
    const {isFocused, content, quantity, unit} = this.state;

    return (
      <View>
        <TextInput
          style={textStyles.textInputActive}
          ref={input => {
            this.firstTextInput = input;
          }}
          onFocus={() => {
            this.setState({isFocused: '1'});
          }}
          placeholder={'Lägg till vara...'}
          placeholderTextColor={'gray'}
          borderColor={'black'}
          returnKeyType="done"
          autoCorrect={false}
          enablesReturnKeyAutomatically={true}
          autoFocus={true}
          autoCapitalize={true}
          onSubmitEditing={() => {
            this.props.addGrocery({content, quantity, unit});
            this.props.closeGroceryForm();
          }}
          inputAccessoryViewID={inputID}
          onChangeText={text => {
            text.length === 0
              ? this.setState({content: text})
              : this.setState({content: text});
          }}
          value={this.state.content}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextInput
            style={textStyles.textInputActive}
            ref={input => {
              this.secondTextInput = input;
            }}
            onFocus={() => {
              this.setState({isFocused: '2'});
            }}
            placeholder={'Antal...'}
            placeholderTextColor={'gray'}
            borderColor={'black'}
            keyboardType={'numeric'}
            returnKeyType="done"
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            autoFocus={false}
            onSubmitEditing={() => {
              this.props.addGrocery({content, quantity, unit});
              this.props.closeGroceryForm();
            }}
            inputAccessoryViewID={inputID}
            onChangeText={text => {
              text.length === 0
                ? this.setState({quantity: text})
                : this.setState({quantity: text});
            }}
            value={this.state.quantity}
          />

          <View style={{marginLeft: '10%'}}>
            <TextInput
              style={textStyles.textInputActive}
              ref={input => {
                this.thirdTextInput = input;
              }}
              onFocus={() => {
                this.setState({isFocused: '3'});
              }}
              placeholder={'Enhet...'}
              placeholderTextColor={'gray'}
              borderColor={'black'}
              returnKeyType="done"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              autoFocus={false}
              autoCapitalize={false}
              onSubmitEditing={() => {
                this.props.addGrocery({content, quantity, unit});
                this.props.closeGroceryForm();
              }}
              inputAccessoryViewID={inputID}
              onChangeText={text => {
                text.length === 0
                  ? this.setState({unit: text})
                  : this.setState({unit: text});
              }}
              value={this.state.unit}
            />
          </View>
        </View>

        <InputAccessoryView
          nativeID={inputID}
          style={styles.InputAccessoryView}
          backgroundColor={'transparent'}>
          <View style={styles.icons}>
            <View style={styles.navigators}>
              <IoniconsIcon
                size={30}
                name={'ios-arrow-back'}
                onPress={() => {
                  isFocused === '1'
                    ? this.thirdTextInput.focus()
                    : isFocused === '2'
                    ? this.firstTextInput.focus()
                    : this.secondTextInput.focus();
                }}
              />
              <IoniconsIcon
                style={{paddingLeft: '7%'}}
                size={30}
                name={'ios-arrow-forward'}
                onPress={() => {
                  isFocused === '1'
                    ? this.secondTextInput.focus()
                    : isFocused === '2'
                    ? this.thirdTextInput.focus()
                    : this.firstTextInput.focus();
                }}
              />
            </View>
            <IoniconsIcon
              size={30}
              name={'md-close'}
              onPress={() => {
                Keyboard.dismiss();
                this.props.closeGroceryForm();
              }}
            />
          </View>
        </InputAccessoryView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  InputAccessoryView: {
    height: 40,
  },
  icons: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    paddingRight: '3%',
    paddingLeft: '3%',
  },
  navigators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

GroceryForm.propTypes = {
  content: PropTypes.string,
  quantity: PropTypes.number,
  unit: PropTypes.string,
  addGrocery: PropTypes.func.isRequired,
  closeGroceryForm: PropTypes.func.isRequired,
};
