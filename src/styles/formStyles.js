import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  formTextInput: {
    padding: 10,
    fontSize: 14,
    borderRadius: 10,
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputError: {
    fontSize: 11,
    color: 'red',
    fontFamily: 'Avenir Next',
    position: 'absolute',
  },
  forgotPassword: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
});
