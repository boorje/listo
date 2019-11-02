import React from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';
import * as colors from '../styles/colors';

const {height, width} = Dimensions.get('window');
const {Value} = Animated;

export default class AddGroceryFooter extends React.Component {
  constructor(props) {
    super(props);
    this.addIconX = new Value(0);
    this.addIconY = new Value(0);
    this.addIconPadding = new Value(0);
    this.formOpacity = new Value(0);
  }
  state = {
    addItemOpen: this.props.addItemOpen,
  };

  openAddIcon = () => {
    Animated.sequence([
      Animated.timing(this.addIconY, {
        toValue: -height / 2.5,
        duration: 300,
      }),
      Animated.timing(this.addIconPadding, {
        toValue: width / 2,
        duration: 100,
      }),
      Animated.timing(this.formOpacity, {
        toValue: 1,
        duration: 100,
      }),
    ]).start();
  };

  closeAddIcon = () => {
    Animated.sequence([
      Animated.timing(this.addIconPadding, {
        toValue: 0,
        duration: 100,
      }),
      Animated.timing(this.addIconY, {
        toValue: 0,
        duration: 200,
      }),
    ]).start();
    this.formOpacity.setValue(0);
  };

  render() {
    return (
      <View style={styles.container}>
        {/* {!this.props.addItemOpen && (
          // TODO: Add when applicable
          <View style={styles.sideIconsView}>
            <IoniconsIcon
              style={styles.sideIconStyle}
              size={50}
              name={'ios-camera'}
              color={'white'}
              onPress={() => {}}
            />
            <IoniconsIcon
              style={styles.sideIconStyle}
              size={40}
              name={'md-images'}
              color={'white'}
              onPress={() => {}}
            />
          </View>
        )} */}
        <Animated.View
          style={[
            styles.addIcon,
            {
              paddingLeft: this.addIconPadding,
              transform: [
                {translateX: this.addIconX},
                {translateY: this.addIconY},
              ],
            },
          ]}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: this.addIconPadding.interpolate({
                    inputRange: [0, width / 2],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            }}>
            <Icon
              size={80}
              name={'add'}
              color={'white'}
              onPress={() => {
                this.props.showAddGrocery();
                if (!this.props.addItemOpen) {
                  this.openAddIcon();
                } else {
                  this.closeAddIcon();
                }
              }}
            />
          </Animated.View>
          {this.props.addItemOpen && (
            <Animated.View style={[styles.form, {opacity: this.formOpacity}]}>
              <GroceryForm
                placeholderColor="white"
                textColor="white"
                //fontWeight="bold"
                closeGroceryForm={() => {
                  this.props.showAddGrocery();
                  this.closeAddIcon();
                }}
                shouldCloseOnSubmit={false}
                addGrocery={this.props.addGrocery}
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  sideIconsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },

  addIcon: {
    position: 'absolute',
    borderRadius: 50,
    justifyContent: 'center',
    top: '-40%',
    alignSelf: 'center',
    backgroundColor: colors.primaryColor,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
  },
  form: {
    position: 'absolute',
    left: '30%',
  },
});

AddGroceryFooter.propTypes = {
  addItemOpen: PropTypes.bool.isRequired,
  showAddGrocery: PropTypes.func.isRequired,
  addGrocery: PropTypes.func.isRequired,
};
