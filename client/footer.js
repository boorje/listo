import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Footer extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableOpacity style={styles.buttonWrapper1}>
          <MaterialCommunityIconsIcon name="timer" style={styles.icon1} />
          <Text style={styles.btn1Text}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeButtonWrapper}>
          <MaterialCommunityIconsIcon name="heart" style={styles.activeIcon} />
          <Text style={styles.activeContent}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper2}>
          <MaterialCommunityIconsIcon
            name="map-marker-radius"
            style={styles.icon2}
          />
          <Text style={styles.btn2Text}>Nearby</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    elevation: 3,
    shadowOffset: {
      height: -2,
      width: 0,
    },
    shadowColor: '#111',
    shadowOpacity: 0,
    shadowRadius: 1,
  },
  buttonWrapper1: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 10,
    minWidth: 80,
    maxWidth: 168,
    paddingHorizontal: 12,
  },
  icon1: {
    backgroundColor: 'transparent',
    color: '#616161',
    fontSize: 24,
    opacity: 1,
  },
  btn1Text: {
    backgroundColor: 'transparent',
    color: '#9E9E9E',
    paddingTop: 4,
    fontSize: 12,
  },
  activeButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 10,
    minWidth: 80,
    maxWidth: 168,
    paddingHorizontal: 12,
  },
  activeIcon: {
    backgroundColor: 'transparent',
    color: '#3f51b5',
    fontSize: 24,
    opacity: 1,
  },
  activeContent: {
    backgroundColor: 'transparent',
    color: '#3f51b5',
    paddingTop: 4,
    fontSize: 14,
  },
  buttonWrapper2: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 10,
    minWidth: 80,
    maxWidth: 168,
    paddingHorizontal: 12,
  },
  icon2: {
    backgroundColor: 'transparent',
    color: '#616161',
    fontSize: 24,
    opacity: 1,
  },
  btn2Text: {
    backgroundColor: 'transparent',
    color: '#9E9E9E',
    paddingTop: 4,
    fontSize: 12,
  },
});
