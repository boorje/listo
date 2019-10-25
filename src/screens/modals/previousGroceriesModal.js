import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import OverlayModal from '../../components/modals/overlayModal';
import PreviousGroceriesContainer from '../../components/previousGroceriesContainer';
import textStyles from '../../styles/textStyles';

const PreviousGroceriesModal = props => (
  <OverlayModal closeModal={props.closeModal} modalTitle={'Tidigare varor'}>
    <View style={styles.container}>
      <PreviousGroceriesContainer></PreviousGroceriesContainer>
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
