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
    content: '',
    quantity: '',
    unit: '',
    id: '',
    isFocused: '',
  };

  componentDidMount = () => {
    if (this.props.item) {
      const {content, quantity, unit, id} = this.props.item;
      this.setState({content, quantity, unit, id});
    }
  };

  handleSubmitEditing = () => {
    const {content, quantity, unit, id} = this.state;
    this.props.addGrocery({content, quantity, unit, id});
    this.setState({content: '', quantity: '', unit: ''});
    if (this.props.shouldCloseOnSubmit) {
      this.props.closeGroceryForm();
    }
  };

  render() {
    const inputID = 'inputID';
    const {content, quantity, unit, isFocused} = this.state;
    return (
      <View>
        <TextInput
          style={[
            textStyles.textInputActive,
            {
              color: this.props.textColor || 'black',
              fontWeight: this.props.fontWeight || 'normal',
            },
          ]}
          ref={input => {
            this.firstTextInput = input;
          }}
          onFocus={() => {
            this.setState({isFocused: '1'});
          }}
          placeholder={'Add grocery...'}
          placeholderTextColor={this.props.placeholderColor || 'gray'}
          borderColor={'black'}
          returnKeyType="done"
          autoCorrect={false}
          blurOnSubmit={this.props.shouldCloseOnSubmit}
          enablesReturnKeyAutomatically={true}
          autoFocus={true}
          autoCapitalize="none"
          onSubmitEditing={() => {
            this.handleSubmitEditing();
            this.firstTextInput.focus();
          }}
          inputAccessoryViewID={inputID}
          onChangeText={text => {
            this.setState({content: text});
          }}
          value={content}
        />

        <View
          style={{
            flexDirection: 'row',
          }}>
          <TextInput
            style={[
              textStyles.textInputActive,
              {
                color: this.props.textColor || 'black',
                fontWeight: this.props.fontWeight || 'normal',
              },
            ]}
            ref={input => {
              this.secondTextInput = input;
            }}
            onFocus={() => {
              this.setState({isFocused: '2'});
            }}
            placeholder="Quantity..."
            placeholderTextColor={this.props.placeholderColor || 'gray'}
            borderColor="black"
            keyboardType="numeric"
            returnKeyType="done"
            autoCorrect={false}
            blurOnSubmit={this.props.shouldCloseOnSubmit}
            enablesReturnKeyAutomatically={true}
            autoFocus={false}
            onSubmitEditing={() => {
              this.handleSubmitEditing();
              this.firstTextInput.focus();
            }}
            inputAccessoryViewID={inputID}
            onChangeText={text => {
              this.setState({quantity: text});
            }}
            value={quantity}
          />

          <View style={{marginLeft: '10%'}}>
            <TextInput
              style={[
                textStyles.textInputActive,
                {
                  color: this.props.textColor || 'black',
                  fontWeight: this.props.fontWeight || 'normal',
                },
              ]}
              ref={input => {
                this.thirdTextInput = input;
              }}
              onFocus={() => {
                this.setState({isFocused: '3'});
              }}
              placeholder={'Unit...'}
              placeholderTextColor={this.props.placeholderColor || 'gray'}
              borderColor={'black'}
              returnKeyType="done"
              autoCorrect={false}
              blurOnSubmit={this.props.shouldCloseOnSubmit}
              enablesReturnKeyAutomatically={true}
              autoFocus={false}
              autoCapitalize="none"
              onSubmitEditing={() => {
                this.handleSubmitEditing();
                this.firstTextInput.focus();
              }}
              inputAccessoryViewID={inputID}
              onChangeText={text => {
                this.setState({unit: text});
              }}
              value={unit}
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
                style={{paddingLeft: '8%'}}
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
    height: 50,
  },
  icons: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: '5%',
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
