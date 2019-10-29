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
    lineHeight: 45,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 3, height: 2},
    textShadowRadius: 10,
  },
  listTitle: {
    fontSize: 30,
    fontFamily: 'Avenir Next',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 5, height: 1},
    textShadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
    color: 'rgba(52, 52, 52, 1)',
    padding: 5,
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
    textShadowOffset: {width: 1, height: 0},
    textShadowRadius: 5,
  },
});

export default textStyles;
