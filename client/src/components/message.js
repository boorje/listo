import React from 'react';
import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../styles/textStyles';

import * as colors from '../styles/colors';

export default class Message extends React.Component {
  state = {
    messageOpen: this.props.messageOpen,
  };
  // static getDerivedStateFromProps(props, state) {
  //   if (props.messageOpen !== state.messageOpen) {
  //     return {
  //       messageOpen: props.messageOpen,
  //     };
  //   }
  // }

  render() {
    return (
      this.state.messageOpen && (
        <Modal animationType="fade" transparent={true} visible={true}>
          <TouchableOpacity
            style={styles.touchableOpacity}
            activeOpacity={1}
            onPress={() => this.props.messageOpen()}>
            <View
              style={[
                styles.warningView,
                {
                  backgroundColor:
                    this.props.type === 'SUCCESS'
                      ? colors.submitColor
                      : colors.errorColor,
                },
              ]}>
              <View style={styles.warningMessage}>
                <Icon size={50} name="warning" color="#fff" />
                <Text
                  style={[
                    textStyles.modalTitle,
                    {color: 'white', marginTop: '20%'},
                  ]}>
                  {this.props.message}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )
    );
  }
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string,
};

const styles = StyleSheet.create({
  touchableOpacity: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningView: {
    width: '80%',
    paddingVertical: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    borderRadius: 20,
  },
  warningMessage: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
