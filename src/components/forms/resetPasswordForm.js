import React from 'react';
import {Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';

const ResetPasswordForm = props => {
  return (
    <View>
      <Formik
        initialValues={{code: '', new_password: ''}}
        onSubmit={values => props.handleSubmit(values)}
        validationSchema={yup.object().shape({
          code: yup
            .number()
            .positive()
            .integer()
            .required(),
          new_password: yup
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
              value={values.code}
              onChangeText={handleChange('code')}
              onBlur={() => setFieldTouched('code')}
              placeholder="Your verification code"
              keyboardType="number-pad"
              style={formStyles.formTextInput}
            />
            {touched.code && errors.code && (
              <Text style={formStyles.inputError}>{errors.code}</Text>
            )}
            <TextInput
              value={values.new_password}
              onChangeText={handleChange('new_password')}
              placeholder="New password"
              onBlur={() => setFieldTouched('new_password')}
              secureTextEntry={true}
              style={formStyles.formTextInput}
            />
            {touched.new_password && errors.new_password && (
              <Text style={formStyles.inputError}>{errors.new_password}</Text>
            )}
            <SubmitButton
              title="RESET PASSWORD"
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

export default ResetPasswordForm;

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
