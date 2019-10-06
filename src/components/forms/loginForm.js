import React from 'react';
import {Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';

const LoginForm = props => (
  <View>
    <Formik
      initialValues={{email: '', password: ''}}
      initialStatus={{hidePassword: true}}
      onSubmit={values => props.handleSubmit(values)}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email()
          .required(),
        password: yup
          .string()
          .min(8)
          .required(),
      })}>
      {({
        setStatus,
        values,
        status,
        handleChange,
        errors,
        setFieldTouched,
        touched,
        isValid,
        handleSubmit,
      }) => (
        <React.Fragment>
          <TextInput
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={() => setFieldTouched('email')}
            placeholder="E-mail"
            autoCapitalize="none"
            style={formStyles.formTextInput}
          />
          {touched.email && errors.email && (
            <Text style={formStyles.inputError}>{errors.email}</Text>
          )}
          <TextInput
            value={values.password}
            onChangeText={handleChange('password')}
            placeholder="Password"
            onBlur={() => setFieldTouched('password')}
            secureTextEntry={status.hidePassword}
            style={formStyles.formTextInput}
          />
          {touched.password && errors.password && (
            <Text style={formStyles.inputError}>{errors.password}</Text>
          )}
          <View style={formStyles.forgotPassword}>
            <Text
              onPress={() => {
                const prevState = status.hidePassword;
                if (prevState) {
                  setStatus({hidePassword: false});
                } else {
                  setStatus({hidePassword: true});
                }
              }}
              style={{color: status.hidePassword ? '#666' : '#333'}}>
              Show password
            </Text>
          </View>
          <SubmitButton
            title="LOGIN"
            disabled={!isValid}
            onPress={handleSubmit}
            type="submit"
            loading={props.loading}
          />
        </React.Fragment>
      )}
    </Formik>
  </View>
);

export default LoginForm;

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
