import React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
// components
import OverlayModal from '../../components/modals/overlayModal';
import PreviousGroceriesContainer from '../../components/previousGroceriesContainer';

const PreviousGroceriesModal = props => (
  <OverlayModal closeModal={props.closeModal} modalTitle={'Crossed-off items'}>
    <View style={styles.container}>
      <PreviousGroceriesContainer />
    </View>
  </OverlayModal>
);

export default PreviousGroceriesModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
