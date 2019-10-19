import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

const ListScreenHeader = props => (
  <View style={styles.container}>
    <View style={styles.icons1}>
      <IoniconsIcon
        size={50}
        color={'#808080'}
        name="ios-arrow-round-back"
        onPress={() => props.goBack()}
      />
      <View style={styles.icons2}>
        <IoniconsIcon
          size={35}
          color={'#808080'}
          name="md-person-add"
          onPress={() => {}}
        />
      </View>
    </View>
  </View>
);

export default ListScreenHeader;

const styles = StyleSheet.create({
  container: {
    top: 0,
    height: '12%',
  },
  icons1: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
    paddingLeft: '3%',
    paddingRight: '3%',
    position: 'absolute',
  },
  icons2: {
    flexDirection: 'row',
  },
});
