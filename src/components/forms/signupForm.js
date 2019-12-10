import React from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SubmitButton from '../buttons/submitButton';
import textStyles from '../../styles/textStyles';

import formStyles from '../../styles/formStyles';

const SignupForm = props => (
  <View style={styles.container}>
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
        values,
        handleChange,
        errors,
        setFieldTouched,
        touched,
        isValid,
        handleSubmit,
        status,
        setStatus,
      }) => (
        <React.Fragment>
          <View style={styles.loginForm}>
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
                onSubmitEditing={() => setFieldTouched('email')}
                placeholder="E-mail"
                placeholderTextColor="white"
                returnKeyType="done"
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
            <View style={styles.textBox}>
              <Icon
                size={20}
                name={'lock'}
                color={'white'}
                style={styles.icon}
              />
              <TextInput
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder="Password"
                placeholderTextColor="white"
                returnKeyType="done"
                onSubmitEditing={() => setFieldTouched('password')}
                secureTextEntry={status.hidePassword}
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputErrorView}>
              <Text
                style={[
                  formStyles.inputError,
                  {opacity: touched.password && errors.password ? 1 : 0},
                ]}>
                {errors.password}
              </Text>
            </View>
          </View>

          <View style={styles.button}>
            <SubmitButton
              title="Create account"
              disabled={!isValid}
              onPress={handleSubmit}
              type="submit"
              loading={props.loading}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: '2%'}}>
            <Text
              onPress={() => props.register()}
              style={[textStyles.smallText, {color: 'white'}]}>
              Already have an account?
            </Text>
            <Text
              onPress={() => props.goBack()}
              style={[
                textStyles.smallText,
                {color: 'white', marginLeft: '1%', fontWeight: 'bold'},
              ]}>
              Sign in
            </Text>
          </View>
        </React.Fragment>
      )}
    </Formik>
  </View>
);

export default SignupForm;

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
    width: '60%',
    marginTop: '5%',
  },
});

SignupForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
