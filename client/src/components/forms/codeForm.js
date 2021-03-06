import React from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import * as yup from 'yup';

import SubmitButton from '../buttons/submitButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

import formStyles from '../../styles/formStyles';

const CodeForm = props => {
  return (
    <View style={styles.container}>
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
            <View style={styles.form}>
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
                  onSubmitEditing={() => setFieldTouched('code')}
                  returnKeyType="done"
                  placeholder="Your verification code"
                  placeholderTextColor="white"
                  autoFocus={false}
                  style={styles.textInput}
                />
              </View>
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
            </View>
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
    color: '#fff',
  },
  textInput: {
    flex: 1,
    fontFamily: 'Avenir Next',
    color: '#fff',
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
    width: '70%',
    marginTop: '5%',
  },
});

CodeForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  submitTitle: PropTypes.string.isRequired,
};
