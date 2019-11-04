import React, {createRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  PanResponder,
  SafeAreaView,
  Animated,
  LayoutAnimation,
} from 'react-native';
import animations from '../styles/animations';

const {Value} = Animated;
const {height, width} = Dimensions.get('window');
class DraggableTest extends React.Component {
  constructor(props) {
    super(props);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.currentIdx = this.yToIndex(gestureState.y0);
        this.currentY = gestureState.y0;
        this.draggingPos.setValue(
          this.currentY - this.listOffset - this.rowHeight / 2,
        ); // ! IMPROVE TO MORE SPECIFIC VALUE

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
          this.currentY - this.listOffset - this.rowHeight / 2,
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
    this.listOffset = 0;
    this.flatlistTopOffset = 0;
    this.flatListHeight = 0;
  }

  state = {
    data: [
      {title: '1'},
      {title: '2'},
      {title: '3'},
      {title: '4'},
      {title: '5'},
      {title: '6'},
      {title: '7'},
      {title: '8'},
      {title: '9'},
      {title: '10'},
      //   {title: '11'},
      //   {title: '12'},
      //   {title: '13'},
      //   {title: '14'},
      //   {title: '15'},
      //   {title: '16'},
      //   {title: '17'},
      //   {title: '18'},
      //   {title: '19'},
      //   {title: '20'},
      //   {title: '21'},
      //   {title: '22'},
      //   {title: '23'},
      //   {title: '24'},
      //   {title: '25'},
      //   {title: '26'},
      //   {title: '27'},
    ],
    dragging: false,
    draggingIndex: -1,
  };

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
      if (this.currentY + 150 > this.flatListHeight) {
        this.flatList.current.scrollToOffset({
          offset: this.scrollOffset + 5,
          animated: false,
        });
      } else if (this.currentY < 150) {
        this.flatList.current.scrollToOffset({
          offset: this.scrollOffset - 5,
          animated: false,
        });
      }

      const newIdx = this.yToIndex(this.currentY);
      if (this.currentIdx !== newIdx) {
        LayoutAnimation.configureNext(animations.default);
        this.setState({
          data: this.immutableMove(this.state.data, this.currentIdx, newIdx),
          draggingIndex: newIdx,
        });
        this.currentIdx = newIdx;
      }
      this.animateList();
    });
  };

  yToIndex = y => {
    const res = Math.floor(
      (y + this.scrollOffset - this.flatlistTopOffset - this.listOffset) /
        this.rowHeight,
    );
    if (res > this.state.data.length - 1) {
      return this.state.data.length - 1;
    } else if (res < 0) {
      return 0;
    }
    return Math.abs(res);
  };

  item({item, index}) {
    return (
      <Animated.View
        onLayout={e => {
          this.rowHeight = e.nativeEvent.layout.height;
        }}
        style={[
          styles.item,
          {
            backgroundColor: '#03B5AA',
            opacity:
              this.state.draggingIndex === index && this.state.dragging ? 0 : 1,
          },
        ]}>
        <View style={styles.itemContent}>
          <Text style={styles.text} {...this._panResponder.panHandlers}>
            @
          </Text>

          <Text style={styles.text}>{item.title}</Text>
        </View>
      </Animated.View>
    );
  }
  FlatListItemSeparator = () => {
    return <View style={[styles.separator]} />;
  };
  render() {
    const {dragging, draggingIndex, data} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={styles.flatlist}
          onLayout={e => {
            this.listOffset = e.nativeEvent.layout.y;
          }}>
          {dragging && (
            <Animated.View style={[styles.dragItem, {top: this.draggingPos}]}>
              {this.item({item: data[draggingIndex]})}
            </Animated.View>
          )}
          <FlatList
            ref={this.flatList}
            data={this.state.data}
            scrollEnabled={!dragging}
            onScroll={e => {
              this.scrollOffset = e.nativeEvent.contentOffset.y;
            }}
            onLayout={e => {
              this.flatlistTopOffset = e.nativeEvent.layout.y;
              this.flatListHeight = e.nativeEvent.layout.height;
            }}
            renderItem={({item, index}) => this.item({item, index})}
            keyExtractor={item => item.title}
            ItemSeparatorComponent={this.FlatListItemSeparator}
          />
        </View>
      </SafeAreaView>
    );
  }
}
export default DraggableTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlist: {
    flex: 1,
    width: '100%',
  },
  separator: {
    height: 0,
    width: '97%',
    marginLeft: '3%',
  },
  item: {
    flex: 1,
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  dragItem: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
  },
  text: {color: 'black', fontSize: 30},
});
