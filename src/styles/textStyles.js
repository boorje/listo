import {StyleSheet} from 'react-native';

const textStyles = StyleSheet.create({
  default: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    paddingRight: '5%',
  },
  textInputActive: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: 'gray',
  },
  badge: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: 'white',
  },
  myLists: {
    fontSize: 40,
    fontFamily: 'Avenir Next',
    color: 'white',
  },
  listTitle: {
    fontSize: 30,
    fontFamily: 'Avenir Next',
    color: 'gray',
  },
  groceryDetails: {
    fontSize: 15,
    fontFamily: 'Avenir Next',
    color: 'gray',
    paddingLeft: '1%',
  },
  button: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: 'white',
  },
  loginHeadline: {
    fontSize: 40,
    fontFamily: 'Avenir Next',
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  smallText: {
    fontSize: 15,
    fontFamily: 'Avenir Next',
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default textStyles;
