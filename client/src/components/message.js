import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
// Components
import Icon from 'react-native-vector-icons/MaterialIcons';
// Styles
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';

export default function Message(props) {
  const [messageOpen, toggleMessage] = useState(props.messageOpen);

  useEffect(() => {
    toggleMessage(props.messageOpen);
  }, [props.messageOpen]);

  return messageOpen ? (
    <Modal animationType="fade" transparent={true} visible={true}>
      <TouchableOpacity
        style={styles.touchableOpacity}
        activeOpacity={1}
        onPress={() => props.closeMessage()}>
        <View
          style={[
            styles.warningView,
            {
              backgroundColor:
                props.type === 'SUCCESS'
                  ? colors.submitColor
                  : colors.errorColor,
            },
          ]}>
          <View style={styles.warningMessage}>
            <Icon size={50} name="warning" color="#fff" />
            <Text style={textStyles.warning}>{props.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  ) : null;
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['SUCCESS']),
};

const styles = StyleSheet.create({
  touchableOpacity: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningView: {
    height: '30%',
    width: '80%',
    opacity: 0.8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningMessage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
