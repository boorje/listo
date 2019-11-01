import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

const HomeScreenBackground = props => (
  <View style={styles.container}>
    <Image
      style={{flex: 1, opacity: 0.6, top: 0}}
      source={{
        uri: BACKGROUND_URL,
      }}
    />
    <View style={styles.headline}>
      <Text style={textStyles.myLists}>Mina</Text>
      <Text style={textStyles.myLists}>Listor</Text>
    </View>
    <View style={styles.iconView}>
      <IoniconsIcon
        style={styles.icon}
        size={40}
        color={'white'}
        name="ios-cog"
        onPress={() => props.openSettings()}
      />
    </View>
  </View>
);

export default HomeScreenBackground;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.2,
  },
  headline: {
    position: 'absolute',
    bottom: '10%',
    marginLeft: '8%',
  },
  iconView: {position: 'absolute', bottom: '10%', right: '8%'},
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 3, height: 1},
    textShadowRadius: 10,
  },
});
