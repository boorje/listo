import React from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SubmitButton from '../buttons/submitButton';

import formStyles from '../../styles/formStyles';
import textStyles from '../../styles/textStyles';
const ResetPasswordForm = props => {
  return (
    <View style={styles.container}>
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
            <View style={styles.loginForm}>
              <View style={styles.textBox}>
                <Icon
                  size={20}
                  name={'check'}
                  color={'white'}
                  style={styles.icon}
                />
                <TextInput
                  value={values.code}
                  onChangeText={handleChange('code')}
                  onBlur={() => setFieldTouched('code')}
                  placeholder="Din verifieringskod"
                  placeholderTextColor="white"
                  keyboardType="number-pad"
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputErrorView}>
                <Text
                  style={[
                    formStyles.inputError,
                    {opacity: touched.code && errors.code ? 1 : 0},
                  ]}>
                  {errors.code}
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
                  value={values.new_password}
                  onChangeText={handleChange('new_password')}
                  placeholder="Nytt lösenord"
                  placeholderTextColor="white"
                  onBlur={() => setFieldTouched('new_password')}
                  secureTextEntry={true}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.inputErrorView}>
                <Text
                  style={[
                    formStyles.inputError,
                    {
                      opacity:
                        touched.new_password && errors._newpassword ? 1 : 0,
                    },
                  ]}>
                  {errors.new_password}
                </Text>
              </View>
            </View>
            <View style={styles.forgotPassword}>
              <Text
                onPress={() => props.forgotPassword()}
                style={[textStyles.smallText, {color: 'white'}]}>
                Forgot password?
              </Text>
            </View>

            <View style={styles.button}>
              <SubmitButton
                title="Reset password"
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

export default ResetPasswordForm;

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

ResetPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
