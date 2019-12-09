import React from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreenBackground = props => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={[textStyles.smallText, {fontSize: 30}]}></Text>
        <Icon
          size={30}
          name={'settings'}
          color={colors.primaryColor}
          onPress={() => props.openSettings()}
        />
        {/* <Text
          onPress={() => props.openSettings()}
          style={[textStyles.smallText, {fontSize: 30}]}>
          ⚙️
        </Text> */}
      </View>
      <View style={styles.myLists}>
        <Text
          style={[
            textStyles.myLists,
            {fontSize: 30, color: colors.primaryColor},
          ]}>
          Lists
        </Text>
      </View>
    </View>
  );
};

export default HomeScreenBackground;

const styles = StyleSheet.create({
  container: {
    height: '12%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
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
    bottom: '10%',
  },
  myLists: {
    position: 'absolute',
    bottom: '2%',
  },
});
