import React from 'react';
import {Text, TextInput, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';
import textStyles from '../../styles/textStyles';

const LoginForm = props => (
  <View style={styles.container}>
    <Formik
      initialValues={{email: ''}}
      onSubmit={values => props.handleLogin(values)}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .email()
          .required(),
      })}>
      {({values, handleChange, errors, touched, isValid, handleSubmit}) => (
        <React.Fragment>
          <View style={styles.form}>
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
                onSubmitEditing={handleSubmit}
                placeholder="E-mail"
                returnKeyType="done"
                placeholderTextColor="white"
                autoCapitalize="none"
                autoCorrect={false}
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
            <SubmitButton
              title="Sign in"
              disabled={!isValid}
              onPress={handleSubmit}
              type="submit"
              loading={props.loading}
              style={styles.button}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: '2%'}}>
            <Text
              onPress={() => props.register()}
              style={[textStyles.smallText, {color: 'white'}]}>
              New to Listo?
            </Text>
            <Text
              onPress={() => props.register()}
              style={[
                textStyles.smallText,
                {color: 'white', marginLeft: '1%', fontWeight: 'bold'},
              ]}>
              Create an account
            </Text>
          </View>
        </React.Fragment>
      )}
    </Formik>
  </View>
);

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '11%',
  },
  form: {width: '80%', alignItems: 'center'},
  textBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    height: 59,
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
    left: '4%',
  },
  inputErrorView: {marginTop: '2%', paddingLeft: '10%'},
  inputError: {
    fontSize: 11,
    color: 'red',
    fontFamily: 'Avenir Next',
  },
  button: {
    width: '100%',
    marginTop: '5%',
  },
});

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
