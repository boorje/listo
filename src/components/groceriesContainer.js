import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  PanResponder,
  PanResponderInstance,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

const immutableMove = (arr, from, to) => {
  return arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
};

class GroceriesContainer extends React.Component {
  state = {
    dragging: false,
    draggingIdx: -1,
    data: this.props.items,
  };

  point = new Animated.ValueXY();
  currentY = 0;
  scrollOffset = 0;
  flatlistTopOffset = 0;
  rowHeight = 0;
  currentIdx = -1;
  active = false;

  constructor(props) {
    super(props);

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        this.currentIdx = this.yToIndex(gestureState.y0);
        this.currentY = gestureState.y0;
        Animated.event([{y: this.point.y}])({
          y: gestureState.y0 - this.rowHeight / 2,
        });
        this.active = true;
        this.setState({dragging: true, draggingIdx: this.currentIdx}, () => {
          //this.animateList();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        Animated.event([{y: this.point.y}])({y: gestureState.moveY});
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.reset();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.reset();
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  animateList = () => {
    if (!this.active) {
      return;
    }

    requestAnimationFrame(() => {
      // check y value see if we need to reorder
      const newIdx = this.yToIndex(this.currentY);
      if (this.currentIdx !== newIdx) {
        this.setState({
          data: immutableMove(this.state.data, this.currentIdx, newIdx),
          draggingIdx: newIdx,
        });
        this.currentIdx = newIdx;
      }

      this.animateList();
    });
  };

  yToIndex = y => {
    const value = Math.floor(
      (this.scrollOffset + y - this.flatlistTopOffset) / this.rowHeight,
    );

    if (value < 0) {
      return 0;
    }

    if (value > this.props.items.length - 1) {
      return this.props.items.length - 1;
    }

    return value;
  };

  reset = () => {
    this.active = false;
    this.setState({dragging: false, draggingIdx: -1});
  };

  renderList(item, index, noPanResponder) {
    const {dragging, draggingIdx} = this.state;
    return (
      <TouchableHighlight
        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        style={styles.container1}
        fontSize={50}
        onPress={() => {
          this.props.removeGrocery(item.id);
        }}
        underlayColor={'transparent'}>
        <View style={styles.container2}>
          <View {...(noPanResponder ? {} : this._panResponder.panHandlers)}>
            <Text style={{fontSize: 28}}>@</Text>
          </View>
          <View style={styles.info}>
            {!item.details ? (
              <Text style={textStyles.default}>{item.content}</Text>
            ) : (
              <GroceryForm
                closeGroceryForm={() => this.props.showGroceryForm(item, index)}
                addGrocery={this.props.updateGrocery}
                item={item}
              />
            )}
          </View>
          <Icon
            size={32}
            name={!item.details ? 'expand-more' : 'expand-less'}
            color={'black'}
            onPress={() => {
              this.props.showGroceryForm(item, index);
            }}
          />
        </View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const {dragging, draggingIdx} = this.state;
    return (
      <View style={{flex: 1}}>
        {dragging && (
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'blue',
              zIndex: 2,
              width: '100%',
              top: this.point.getLayout().top,
            }}>
            {this.renderList(
              {item: this.props.items[draggingIdx], index: -1},
              true,
            )}
          </Animated.View>
        )}
        <KeyboardAwareFlatList
          scrollEnabled={true}
          data={this.props.items}
          renderItem={({item, index}, noPanResponder = false) => {
            return this.renderList(item, index, noPanResponder);
          }}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          keyboardShouldPersistTaps="always"
          onScroll={e => {
            this.scrollOffset = e.nativeEvent.contentOffset.y;
          }}
          onLayout={e => {
            this.flatlistTopOffset = e.nativeEvent.layout.y;
          }}
        />
      </View>
    );
  }
}

export default GroceriesContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '10%',
    paddingRight: '10%',
  },
  separator: {
    height: 1,
    width: '97%',
    marginLeft: '3%',
    marginRight: '0%',
    backgroundColor: '#607D8B',
  },
  container1: {
    flex: 1,
  },
  info: {},
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
  },
});

GroceriesContainer.propTypes = {
  showGroceryForm: PropTypes.func.isRequired,
  updateGrocery: PropTypes.func.isRequired,
  removeGrocery: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      quantity: PropTypes.number,
      unit: PropTypes.string,
    }).isRequired,
  ),
};
