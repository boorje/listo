import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

/**
 * The BaseForm has a email field and a password field
 * @param {*} props props has handleSubmit() and submitTitle
 */
const AuthForm = props => {
  return (
    <View>
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

            <SubmitButton
              title={props.submitTitle}
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
};

export default AuthForm;

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 20,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    height: 60,
  },
  error: {fontSize: 11, color: 'red', marginLeft: 20},
});

AuthForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitTitle: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};
