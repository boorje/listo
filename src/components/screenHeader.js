import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';
import * as colors from '../styles/colors';

const ScreenHeader = props => (
  <View style={styles.container}>
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
    backgroundColor: colors.primaryColor,
    height: '20%',
    justifyContent: 'center',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '3%',
    paddingBottom: '3%',
    position: 'absolute',
  },
  iconStyle: {
    paddingRight: '10%',
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

ScreenHeader.propTypes = {
  leftIconPress: PropTypes.func.isRequired,
  leftIcon: PropTypes.string.isRequired,
};
