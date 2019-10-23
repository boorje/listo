import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';

const ListScreenHeader = props => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={{
        uri: BACKGROUND_URL,
      }}
    />
    <View style={styles.iconView}>
      <IoniconsIcon
        style={styles.iconStyle}
        size={50}
        color={'white'}
        name="ios-arrow-round-back"
        onPress={() => props.goBack()}
      />
      <Text style={textStyles.listTitle}>{props.navigation}</Text>
      <IoniconsIcon
        style={styles.iconStyle}
        size={35}
        color={'white'}
        name="md-person-add"
        onPress={() => props.sharingOptions()}
      />
    </View>
  </View>
);

export default ListScreenHeader;

const styles = StyleSheet.create({
  container: {
    top: 0,
    height: '15%',
    justifyContent: 'flex-end',
  },
  image: {flex: 1, opacity: 0.6, top: 0},
  iconView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingBottom: '3%',
    position: 'absolute',
  },
  iconStyle: {
    paddingLeft: '5%',
    paddingRight: '5%',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 3, height: 1},
    textShadowRadius: 10,
  },
});
