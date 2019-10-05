import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

const VerificationForm = props => {
  return (
    <View>
      <Formik
        initialValues={{code: ''}}
        onSubmit={values => props.handleSubmit(values)}
        validationSchema={yup.object().shape({
          code: yup
            .string()
            .min(6)
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
              value={values.code}
              onChangeText={handleChange('code')}
              onBlur={() => setFieldTouched('code')}
              placeholder="Your verification code"
              keyboardType="number-pad"
              style={styles.textInput}
            />
            {touched.code && errors.code && (
              <Text style={styles.error}>{errors.code}</Text>
            )}
            <SubmitButton
              title="VERIFY CODE"
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

export default VerificationForm;

const styles = StyleSheet.create({
  textInput: {
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

VerificationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
