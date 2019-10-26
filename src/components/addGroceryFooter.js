import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';
import {validate, thisExpression} from '@babel/types';

const {height, width} = Dimensions.get('window');
const {Value} = Animated;

export default class AddGroceryFooter extends React.Component {
  constructor(props) {
    super(props);

    this.addIconX = new Value(0);
    this.addIconY = new Value(0);
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
      Animated.timing(this.addIconX, {
        toValue: width / 4,
        duration: 200,
      }),
    ]).start();
  };

  closeAddIcon = () => {
    Animated.sequence([
      Animated.timing(this.addIconX, {
        toValue: 0,
        duration: 200,
      }),
      Animated.timing(this.addIconY, {
        toValue: 0,
        duration: 300,
      }),
    ]).start();
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.props.addItemOpen && (
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
        )}
        <Animated.View
          style={[
            styles.addIcon,
            {
              transform: [
                {translateX: this.addIconX},
                {translateY: this.addIconY},
                {
                  rotate: this.addIconX.interpolate({
                    inputRange: [0, width / 4],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            },
          ]}>
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
          <Animated.View>
            <GroceryForm
              closeGroceryForm={() => {
                this.props.showAddGrocery();
                this.closeAddIcon();
              }}
              addGrocery={this.props.addGrocery}
            />
          </Animated.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3E3E3',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
  sideIconsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  addIcon: {
    //flexDirection: 'row',
    position: 'absolute',
    borderRadius: 50,
    top: '-50%',
    alignSelf: 'center',
    backgroundColor: '#06BA63',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },

  sideIconStyle: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 2,
    shadowOpacity: 1,
  },
});

AddGroceryFooter.propTypes = {
  addItemOpen: PropTypes.bool.isRequired,
  showAddGrocery: PropTypes.func.isRequired,
  addGrocery: PropTypes.func.isRequired,
};
