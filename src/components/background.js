import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

const Background = props => (
  <View style={{flex: 3}}>
    <Image
      style={{flex: 1, opacity: 0.8, top: 0}}
      source={{
        uri:
          'https://images.unsplash.com/photo-1506202687253-52e1b29d3527?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
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
