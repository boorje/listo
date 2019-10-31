import React from 'react';
import {StyleSheet, View, TextInput, Animated, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';

const {Value} = Animated;
const {width, height} = Dimensions.get('window');
export default class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.addIconPadding = new Value(0);
  }

  state = {
    isOpen: false,
    emailInput: '',
  };

  openAddIcon = () => {
    Animated.timing(this.addIconPadding, {
      toValue: width / 1.5,
      duration: 200,
    }).start();
    this.setState({isOpen: true});
    this.props.expandModal();
  };
  closeAddIcon = () => {
    Animated.timing(this.addIconPadding, {
      toValue: 0,
      duration: 200,
    }).start();
    this.setState({isOpen: false});
  };
  render() {
    const {isOpen, emailInput} = this.state;
    return (
      <Animated.View
        style={[
          styles.container,
          {
            paddingLeft: this.addIconPadding,
          },
        ]}>
        {isOpen && (
          <View style={styles.textInputView}>
            <TextInput
              style={[textStyles.default, styles.textInput, {fontSize: 17}]}
              onChangeText={text => this.setState({emailInput: text})}
              onSubmitEditing={() => {
                if (this.state.emailInput !== '') {
                  this.props.addEditor(emailInput);
                }
                this.closeAddIcon();
                this.setState({emailInput: ''});
              }}
              value={this.state.emailInput}
              autoCapitalize="none"
              autoFocus={true}
              autoCorrect={false}
              placeholder="Skriv in e-mail..."
              placeholderTextColor="white"
            />
          </View>
        )}
        <Icon
          style={[styles.icon]}
          size={40}
          name={'person-add'}
          color={'white'}
          onPress={() => this.openAddIcon()}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: '#06BA63',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  icon: {
    padding: '2%',
  },
  textInputView: {
    width: width / 1.5,
    position: 'absolute',
    paddingLeft: '15%',
  },
  textInput: {color: 'white', fontWeight: 'bold'},
});

AddUser.propTypes = {};
