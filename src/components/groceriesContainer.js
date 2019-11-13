import React, {createRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  LayoutAnimation,
  Animated,
  RefreshControl,
  Dimensions,
  FlatList,
  PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
// components
import GroceryForm from './forms/groceryForm';
import EmptyListInfo from './emptyListInfo';
// styles
import textStyles from '../styles/textStyles';
import animations from '../styles/animations';
import * as colors from '../styles/colors';

const {Value} = Animated;

class GroceriesContainer extends React.Component {
  constructor(props) {
    super(props);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.currentIdx = this.yToIndex(gestureState.y0);
        this.currentY = gestureState.y0;
        this.draggingPos.setValue(
          this.currentY - this.state.parentOffset - this.rowHeight / 2,
        );

        this.setState(
          {
            dragging: true,
            draggingIndex: this.currentIdx,
          },
          () => this.animateList(),
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        this.draggingPos.setValue(
          this.currentY - this.state.parentOffset - this.rowHeight / 2,
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({dragging: false});
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });

    this.currentY = 0;
    this.currentIdx = -1;
    this.rowHeight = 0;
    this.draggingPos = new Value(0);
    this.flatList = createRef();
    this.scrollOffset = 0;
    this.flatlistTopOffset = 0;
    this.flatListHeight = 0;
  }
  state = {
    groceries: this.props.groceries,
    refreshing: false,
    removeId: '',
    dragging: false,
    draggingIndex: -1,
    parentOffset: this.props.parentOffset,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.parentOffset !== state.parentOffset) {
      return {
        parentOffset: props.parentOffset,
      };
    }
    return null;
  }

  // ? enough comparison
  componentDidUpdate(prevProps) {
    const {groceries} = this.props;
    if (groceries.length !== prevProps.groceries.length) {
      this.setState({groceries: this.props.groceries});
    }
  }

  immutableMove(arr, from, to) {
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
  }

  animateList = () => {
    if (!this.state.dragging) {
      return;
    }
    requestAnimationFrame(() => {
      // if (this.currentY + 150 > this.flatListHeight) {
      //   this.flatList.current.scrollToOffset({
      //     offset: this.scrollOffset + 5,
      //     animated: false,
      //   });
      // } else if (this.currentY < 150) {
      //   this.flatList.current.scrollToOffset({
      //     offset: this.scrollOffset - 5,
      //     animated: false,
      //   });
      // }
      const newIdx = this.yToIndex(this.currentY);
      if (this.currentIdx !== newIdx) {
        LayoutAnimation.configureNext(animations.default);
        this.setState({
          groceries: this.immutableMove(
            this.state.groceries,
            this.currentIdx,
            newIdx,
          ),
          draggingIndex: newIdx,
        });
        this.currentIdx = newIdx;
      }
      this.animateList();
    });
  };

  yToIndex = y => {
    if (y < this.state.parentOffset - this.rowHeight) {
      return 0;
    }
    const res =
      (Math.abs(y - this.state.parentOffset) +
        this.scrollOffset -
        this.flatlistTopOffset) /
      this.rowHeight;
    if (res > this.state.groceries.length - 1) {
      return this.state.groceries.length - 1;
    } else if (res < 0) {
      return 0;
    }
    return Math.floor(Math.abs(res));
  };

  // ! When updating item. Can not open details before reload.
  // ! Sets the details = true correctly. Probably not re-rendering in renderItem()
  showGroceryForm = grocery => {
    const copy = this.state.groceries.map(item => {
      if (grocery.details || item.id !== grocery.id) {
        item.details = false;
      } else {
        item.details = true;
      }
      return item;
    });
    LayoutAnimation.configureNext(animations.default);
    this.setState({
      groceries: copy,
    });
  };

  renderItem(grocery, index) {
    return (
      <TouchableHighlight
        style={{flex: 1}}
        fontSize={50}
        onPress={() => {
          if (!this.props.addItemOpen) {
            this.props.removeGrocery(grocery.id);
          }
        }}
        underlayColor={'transparent'}>
        <Animated.View
          onLayout={e => {
            this.rowHeight = e.nativeEvent.layout.height;
          }}
          style={[
            styles.container2,
            {
              opacity:
                this.state.draggingIndex === index && this.state.dragging
                  ? 0
                  : 1,
            },
          ]}>
          <View style={{flex: 1, paddingLeft: '5%'}}>
            {grocery.details ? (
              <View>
                <GroceryForm
                  closeGroceryForm={() => this.showGroceryForm(grocery)}
                  addGrocery={this.props.updateGrocery}
                  item={grocery}
                  shouldCloseOnSubmit={true}
                />
              </View>
            ) : (
              <View style={styles.textInfo}>
                <Text style={textStyles.default}>{grocery.content}</Text>
                <Text style={textStyles.groceryDetails}>
                  {grocery.quantity}
                </Text>
                <Text style={textStyles.groceryDetails}>{grocery.unit}</Text>
              </View>
            )}
          </View>
          <Animated.View>
            <Icon
              {...this._panResponder.panHandlers}
              size={32}
              name={!grocery.details ? 'expand-more' : 'expand-less'}
              color={'black'}
              // onPress={() => {
              //   if (!this.props.addItemOpen) {
              //     this.showGroceryForm(grocery);
              //   }
              // }}
            />
          </Animated.View>
        </Animated.View>
      </TouchableHighlight>
    );
  }

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const {groceries, dragging, draggingIndex} = this.state;
    return (
      <View style={{flex: 1}}>
        <View style={styles.groceries}>
          {this.state.groceries.length === 0 && (
            <EmptyListInfo emoji={this.props.addItemOpen ? '😃' : '🥺'} />
          )}
          {dragging && (
            <Animated.View style={[styles.dragItem, {top: this.draggingPos}]}>
              {this.renderItem(groceries[draggingIndex])}
            </Animated.View>
          )}
          <KeyboardAwareFlatList
            ref={this.flatList}
            contentContainerStyle={{marginBottom: 10}}
            scrollEnabled={!dragging}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                tintColor={colors.primaryColor}
                onRefresh={() => this.props.onRefresh()}
              />
            }
            onScroll={e => {
              this.scrollOffset = e.nativeEvent.contentOffset.y;
            }}
            onLayout={e => {
              this.flatlistTopOffset = e.nativeEvent.layout.y;
              this.flatListHeight = e.nativeEvent.layout.height;
            }}
            data={this.props.groceries}
            renderItem={({item, index}) => this.renderItem(item, index)}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );
  }
}

export default GroceriesContainer;

const styles = StyleSheet.create({
  groceries: {
    position: 'absolute',
    //top: '-9%',
    height: '110%',
    backgroundColor: 'white',
    paddingTop: '3%',
    width: '95%',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryColor,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    marginLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
    marginRight: -1,
  },
  separator: {
    height: 3,
    width: '97%',
    marginLeft: '3%',
  },
  textInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dragItem: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
  },
});

GroceriesContainer.propTypes = {
  groceries: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  addGrocery: PropTypes.func.isRequired,
  updateGrocery: PropTypes.func.isRequired,
  removeGrocery: PropTypes.func.isRequired,
};
