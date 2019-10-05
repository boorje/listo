import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import ButtonLarge from './buttons/buttonLarge';

/**
 * The BaseForm has a email field and a password field
 * @param {*} props props has handleSubmit() and submitTitle
 */
const BaseForm = props => {
  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{email: '', password: ''}}
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
          values,
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
              style={styles.textInput}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            <TextInput
              value={values.password}
              onChangeText={handleChange('password')}
              placeholder="Password"
              onBlur={() => setFieldTouched('password')}
              secureTextEntry={true}
              style={styles.textInput}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <ButtonLarge
              title={props.submitTitle}
              disabled={!isValid}
              onPress={handleSubmit}
              type="submit"
            />
          </React.Fragment>
        )}
      </Formik>
    </View>
  );
};

export const SignupForm = props => (
  <View style={styles.formContainer}>
    <BaseForm handleSubmit={props.handleSubmit} submitTitle="SIGN UP" />
  </View>
);

export const LoginForm = props => (
  <View style={styles.formContainer}>
    <BaseForm handleSubmit={props.handleSubmit} submitTitle="LOGIN" />
  </View>
);

const styles = StyleSheet.create({
  formContainer: {margin: 10},
  textInput: {
    margin: 20,
    marginBottom: 5,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    height: 60,
  },
  error: {fontSize: 11, color: 'red', marginLeft: 20},
});

BaseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitTitle: PropTypes.string.isRequired,
};

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};
