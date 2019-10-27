import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import OverlayModal from '../../components/modals/overlayModal';
import PrimaryButton from '../../components/buttons/primaryButton';
import textStyles from '../../styles/textStyles';

const SettingsModal = props => (
  <OverlayModal closeModal={props.closeModal} modalTitle={'Inställningar'}>
    <View style={styles.container}>
      <View style={styles.button}>
        <PrimaryButton title="Logga ut" onPress={() => this._logout()} />
      </View>
    </View>
  </OverlayModal>
);

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: '70%',
  },
});
