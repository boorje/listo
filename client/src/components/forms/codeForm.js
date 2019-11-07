import React from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';

const CodeForm = props => {
  return (
    <View style={styles.container}>
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
              onSubmitEditing={() => setFieldTouched('code')}
              returnKeyType="done"
              placeholder="Your verification code"
              keyboardType="number-pad"
              autoFocus={false}
              style={styles.textInput}
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  loginForm: {width: '100%', alignItems: 'center'},
  textBox: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Avenir Next',
    color: 'white',
    padding: 15,
    paddingLeft: '12%',
  },
  icon: {
    position: 'absolute',
    left: '2%',
  },
  inputErrorView: {marginTop: '2%', paddingLeft: '10%'},
  inputError: {
    fontSize: 11,
    color: 'red',
    fontFamily: 'Avenir Next',
  },
  forgotPassword: {
    marginTop: '5%',
  },
  button: {
    width: '70%',
    marginTop: '5%',
  },
});

CodeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submitTitle: PropTypes.string.isRequired,
};
