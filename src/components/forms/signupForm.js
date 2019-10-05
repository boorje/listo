import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import AuthForm from './authForm';

const SignupForm = props => (
  <View>
    <AuthForm
      handleSubmit={props.handleSubmit}
      submitTitle="SIGN UP"
      loading={props.loading}
    />
  </View>
);

export default SignupForm;

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
