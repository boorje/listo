import React from 'react';
import {Text, TextInput, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';

const CodeForm = props => {
  return (
    <View>
      <Formik
        initialValues={{code: ''}}
        onSubmit={values => props.handleSubmit(values)}
        validationSchema={yup.object().shape({
          code: yup
            .number()
            .positive()
            .integer()
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

export default CodeForm;

CodeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submitTitle: PropTypes.string.isRequired,
};
