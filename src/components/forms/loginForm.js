import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

import AuthForm from './authForm';

export const LoginForm = props => (
  <View>
    <AuthForm
      handleSubmit={props.handleSubmit}
      submitTitle="LOGIN"
      loading={props.loading}
    />
  </View>
);

export default LoginForm;

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
