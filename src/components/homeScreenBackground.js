import React from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';

const HomeScreenBackground = props => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={[textStyles.smallText, {color: 'white', fontSize: 40}]}>
          👋🏼
        </Text>
        <Icon
          size={30}
          name={'settings'}
          color={'white'}
          onPress={() => props.openSettings()}
        />
      </View>
      <View style={styles.myLists}>
        <Text style={textStyles.myLists}>My lists</Text>
      </View>
    </View>
  );
};

export default HomeScreenBackground;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    backgroundColor: colors.primaryColor,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  top: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: '5%',
    top: '25%',
  },
  myLists: {
    position: 'absolute',
    bottom: '15%',
  },
});
