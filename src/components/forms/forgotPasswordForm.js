import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';

const VerificationForm = props => {
  return (
    <View>
      <Formik
        initialValues={{email: ''}}
        onSubmit={values => props.handleSubmit(values)}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email()
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
              style={formStyles.formTextInput}
            />
            {touched.email && errors.email && (
              <Text style={formStyles.inputError}>{errors.email}</Text>
            )}
            <SubmitButton
              title="SEND EMAIL"
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

VerificationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
