import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

const Background = props => (
  <View style={{flex: 3}}>
    <Image
      style={{flex: 1, opacity: 0.6, top: 0}}
      source={{
        uri: BACKGROUND_URL,
      }}
    />
    <View style={styles.headline1}>
      <Text style={textStyles.myLists}>Mina</Text>
      <Text style={textStyles.myLists}>Listor</Text>
    </View>
    <View style={styles.headline2}>
      <IoniconsIcon
        size={40}
        color={'white'}
        name="ios-cog"
        onPress={() => props.navigate('Settings')}
      />
    </View>
  </View>
);

export default Background;

const styles = StyleSheet.create({
  headline1: {position: 'absolute', bottom: '10%', marginLeft: '8%'},
  headline2: {position: 'absolute', bottom: '10%', right: '8%'},
});
