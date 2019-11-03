import React, {createRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  PanResponder,
  Animated,
} from 'react-native';

const {Value} = Animated;
const {height, width} = Dimensions.get('window');
class DraggableTest extends React.Component {
  constructor(props) {
    super(props);

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.initialIndex = this.yToIndex(gestureState.y0);
        this.currentIdx = this.yToIndex(gestureState.y0);
        this.setDraggingPos();
        this.setState(
          {
            dragging: true,
            draggingIndex: this.initialIndex,
          },
          () => this.animateList(),
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        this.currentY = gestureState.moveY;
        this.draggingPos.setValue(
          gestureState.dy + this.initialIndex * this.rowHeight,
        );
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({dragging: false});
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
    });

    this.initialIndex = -1;
    this.listOffset = 0;
    this.currentY = 0;
    this.currentIdx = -1;
    this.rowHeight = 0;
    this.draggingPos = new Value(0);
    this.flatlist = createRef();
    this.scrollOffset = 0;
  }

  state = {
    data: [
      {title: '1'},
      {title: '2'},
      {title: '3'},
      {title: '4'},
      {title: '5'},
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
      // Check if we should reorder

      const newIdx = this.yToIndex(this.currentY);
      if (this.currentIdx !== newIdx) {
        console.log(this.currentIdx);
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
    const res = Math.floor((y - this.listOffset) / this.rowHeight);
    if (res > this.state.data.length - 1) {
      return this.state.data.length - 1;
    } else if (res < 0) {
      return 0;
    }
    return Math.abs(res);
  };

  setDraggingPos = () => {
    this.draggingPos.setValue(this.initialIndex * this.rowHeight + 3);
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
      <View style={styles.container}>
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
            renderItem={({item, index}) => this.item({item, index})}
            keyExtractor={item => item.title}
            ItemSeparatorComponent={this.FlatListItemSeparator}
          />
        </View>
      </View>
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
    top: height / 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  separator: {
    height: 0,
    width: '97%',
    marginLeft: '3%',
  },
  item: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
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
