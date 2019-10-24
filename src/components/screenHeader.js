import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';

const ScreenHeader = props => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={{
        uri: props.background,
      }}
    />
    <View style={styles.container2}>
      <View style={{flex: 1}}>
        <IoniconsIcon
          style={styles.iconStyle}
          size={50}
          color={'white'}
          name={props.leftIcon}
          onPress={() => props.leftIconPress()}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={textStyles.listTitle}>{props.headerTitle}</Text>
      </View>
      <View style={styles.rightIcons}>
        {props.rightIcon1 && (
          <IoniconsIcon
            style={[styles.iconStyle, {paddingRight: '15%'}]}
            size={35}
            color={'white'}
            name={props.rightIcon1}
            onPress={() => props.rightIcon1Press()}
          />
        )}
        {props.rightIcon2 && (
          <IoniconsIcon
            style={styles.iconStyle}
            size={35}
            color={'white'}
            name={props.rightIcon2}
            onPress={() => props.rightIcon2Press()}
          />
        )}
      </View>
    </View>
  </View>
);

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    top: 0,
    height: '15%',
    justifyContent: 'flex-end',
  },
  image: {flex: 1, opacity: 0.6, top: 0},
  container2: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    paddingBottom: '3%',
    position: 'absolute',
  },
  iconStyle: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 3, height: 1},
    textShadowRadius: 10,
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

ScreenHeader.propTypes = {
  background: PropTypes.string.isRequired,
  leftIconPress: PropTypes.func.isRequired,
  leftIcon: PropTypes.string.isRequired,
};
