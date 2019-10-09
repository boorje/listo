import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  PanResponder,
  PanResponderInstance,
  Animated,
  LayoutAnimation,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroceryForm from './forms/groceryForm';
import textStyles from '../styles/textStyles';
import animations from '../styles/animations';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import AddGroceryFooter from '../components/addGroceryFooter';

// -- API helpers --
import {
  getGroceryList,
  createGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from '../api/groceryListsAPI';

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
    groceries: [],
    groceryListID: '',
    apiError: '',
    adjustFooter: false,
    addItemOpen: false,
    dragging: false,
    draggingIdx: -1,
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
        console.log(this.currentIdx);
        this.currentY = gestureState.y0;
        Animated.event([{y: this.point.y}])({
          y: gestureState.y0 - 2.4 * this.rowHeight,
        });
        this.active = true;
        this.setState({dragging: true, draggingIdx: this.currentIdx}, () => {
          this.animateList();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        Animated.event([{y: this.point.y}])({
          y: gestureState.moveY - 2.4 * this.rowHeight,
        });
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
          groceries: immutableMove(
            this.state.groceries,
            this.currentIdx,
            newIdx,
          ),
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
    if (value > this.state.groceries.length - 1) {
      return this.state.groceries.length - 1;
    }
    return value - 2;
  };

  reset = () => {
    this.active = false;
    this.setState({dragging: false, draggingIdx: -1});
  };

  componentDidMount = async () => {
    try {
      const groceryList = await this.props.navigation.getParam(
        'groceryList',
        null,
      );
      this.setState({groceryListID: groceryList.id});
      this.props.navigation.setParams({title: groceryList.title});
      const groceries = await getGroceryList(groceryList.id);
      if (groceries) {
        groceries.details = false;
        this.setState({groceries});
      }
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  addGrocery = async grocery => {
    try {
      const newGroceryID = await createGroceryItem(
        grocery,
        this.state.groceryListID,
      );
      const {content, quantity, unit} = grocery;
      LayoutAnimation.spring();
      this.setState({
        groceries: [
          ...this.state.groceries,
          {
            content,
            quantity,
            unit,
            details: false,
            id: newGroceryID,
          },
        ],
      });
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  removeGrocery = async id => {
    try {
      const deleteGrocery = await deleteGroceryItem(id);
      const stateCopy = this.state.groceries.filter(
        grocery => grocery.id !== deleteGrocery.id,
      );
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  updateGrocery = async updatedGrocery => {
    try {
      const res = await updateGroceryItem(updatedGrocery);
      const stateCopy = this.state.groceries.map(grocery => {
        if (grocery.id === res.id) {
          grocery.content = updatedGrocery.content;
          grocery.quantity = updatedGrocery.quantity;
          grocery.unit = updatedGrocery.unit;
        }
        return grocery;
      });
      LayoutAnimation.spring();
      this.setState({groceries: stateCopy});
    } catch (error) {
      this.props.updateApiError(error);
    }
  };

  showGroceryForm = (grocery, index) => {
    if (this.state.addItemOpen) {
      this.setState({adjustFooter: false, addItemOpen: false});
    }
    let groceriesCopy = [...this.state.groceries];
    if (grocery.details) {
      groceriesCopy[index].details = false;
    } else {
      groceriesCopy[index].details = true;
    }
    LayoutAnimation.configureNext(animations.default);
    this.setState({
      groceries: groceriesCopy,
    });
  };

  showAddGrocery = () => {
    if (this.state.addItemOpen === false) {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: true});
    } else {
      LayoutAnimation.configureNext(animations.default);
      this.setState({addItemOpen: false});
    }
    this.adjustFooter();
  };

  adjustFooter = () => {
    LayoutAnimation.configureNext(animations.default);
    this.setState({adjustFooter: !this.state.adjustFooter ? true : false});
  };

  renderList(item, index, noPanResponder) {
    return (
      <TouchableHighlight
        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        style={{flex: 1, opacity: this.state.draggingIdx === index ? 0 : 1}}
        fontSize={50}
        onPress={() => {
          this.removeGrocery(item.id);
        }}
        underlayColor={'transparent'}>
        <View style={styles.container2}>
          <View {...(noPanResponder ? {} : this._panResponder.panHandlers)}>
            <Text style={{fontSize: 28}}>@</Text>
          </View>
          {!item.details ? (
            <Text style={textStyles.default}>{item.content}</Text>
          ) : (
            <GroceryForm
              closeGroceryForm={() => this.showGroceryForm(item, index)}
              addGrocery={this.updateGrocery}
              item={item}
            />
          )}
          <Icon
            size={32}
            name={!item.details ? 'expand-more' : 'expand-less'}
            color={'black'}
            onPress={() => {
              this.showGroceryForm(item, index);
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
    const {groceries, dragging, draggingIdx} = this.state;
    console.log(this.point.getLayout().top);
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 8}}>
          {dragging && (
            <Animated.View
              style={{
                position: 'absolute',
                backgroundColor: 'blue',
                zIndex: 2,
                width: '100%',
                top: this.point.getLayout().top,
              }}>
              {this.renderList({item: groceries[draggingIdx], index: -1}, true)}
            </Animated.View>
          )}
          <KeyboardAwareFlatList
            scrollEnabled={true}
            data={groceries}
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
        <View
          style={{
            justifyContent: !this.state.adjustFooter ? 'center' : 'flex-start',
            flex: !this.state.adjustFooter ? 1 : 9,
            paddingTop: !this.state.adjustFooter ? 0 : 20,
            borderTopWidth: 0.5,
            paddingBottom: 0,
          }}>
          <AddGroceryFooter
            addGrocery={this.addGrocery}
            addItemOpen={this.state.addItemOpen}
            showAddGrocery={this.showAddGrocery}
          />
        </View>
      </SafeAreaView>
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
  updateApiError: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};
