import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TextInput, Animated, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
//styles
import * as colors from '../styles/colors';
import textStyles from '../styles/textStyles';

const {width} = Dimensions.get('window');

export default function AddUser(props) {
  const [emailInput, setEmailInput] = useState('');
  const [isOpen, toggleOpen] = useState(false);
  const [addIconPadding] = useState(new Animated.Value(0));

  useEffect(() => {
    if (props.modalExpanded) toggleIcon();
  }, [props.modalExpanded]);

  function toggleIcon() {
    Animated.timing(addIconPadding, {
      toValue: isOpen ? 0 : width / 1.5,
      duration: 200,
    }).start();
    toggleOpen(!isOpen);
    props.expandModal();
  }

  function addEditor() {
    if (emailInput.length > 0) {
      props.addEditor(emailInput);
      setEmailInput('');
    }
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingLeft: addIconPadding,
        },
      ]}>
      {isOpen && (
        <View style={styles.textInputView}>
          <TextInput
            style={[textStyles.default, styles.textInput, {fontSize: 17}]}
            onChangeText={text => setEmailInput(text)}
            onSubmitEditing={() => addEditor()}
            value={emailInput}
            autoCapitalize="none"
            autoFocus={true}
            autoCorrect={false}
            placeholder="Enter email"
            placeholderTextColor="#fff"
          />
        </View>
      )}
      <Icon
        style={styles.icon}
        size={40}
        name="person-add"
        color="#fff"
        onPress={() => toggleIcon()}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
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
  textInput: {color: 'white'},
});

AddUser.propTypes = {
  expandModal: PropTypes.func.isRequired,
  modalExpanded: PropTypes.bool.isRequired,
  addEditor: PropTypes.func.isRequired,
};
