import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import textStyles from '../../styles/textStyles';
import OverlayModal from '../../components/modals/overlayModal';

const SharingModal = props => (
  <OverlayModal
    closeModal={props.closeModal}
    modalTitle={'Delningsinställningar'}
  />
);

export default SharingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
