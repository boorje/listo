import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import textStyles from '../../styles/textStyles';
import OverlayModal from '../../components/modals/overlayModal';

const SharingModal = props => (
  <OverlayModal closeModal={props.closeModal} modalTitle={'Delning'} />
);

export default SharingModal;

const styles = StyleSheet.create({});
