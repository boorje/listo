import React from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';

const ForgotPasswordForm = props => {
  return (
    <View style={styles.container}>
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
            <View style={styles.textBox}>
              <Icon
                size={20}
                name={'mail'}
                color={'white'}
                style={styles.icon}
              />
              <TextInput
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                placeholder="E-mail"
                placeholderTextColor="white"
                autoCapitalize="none"
                autoFocus={false}
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputErrorView}>
              <Text
                style={[
                  formStyles.inputError,
                  {opacity: touched.email && errors.email ? 1 : 0},
                ]}>
                {errors.email}
              </Text>
            </View>
            <View style={styles.button}>
              <SubmitButton
                title="Send"
                disabled={!isValid}
                onPress={handleSubmit}
                type="submit"
                loading={props.loading}
              />
            </View>
          </React.Fragment>
        )}
      </Formik>
    </View>
  );
};

export default ForgotPasswordForm;

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
    padding: 15,
    paddingLeft: '12%',
    color: 'white',
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

ForgotPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
