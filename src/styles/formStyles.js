import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  formTextInput: {
    marginTop: 20,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 3,
    height: 60,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  inputError: {fontSize: 11, color: 'red', marginLeft: 20},
  forgotPassword: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
});
