import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
  RefreshControl,
} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
// components
import GroceryForm from './forms/groceryForm';
import EmptyListInfo from './emptyListInfo';
// styles
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';
// api
import * as queries from '../api/queries';

function GroceryItem(props) {
  const [detailsOpen, toggleDetails] = useState(false);
  const {addItemOpen, grocery, removeGrocery, updateGrocery} = props;
  return (
    <TouchableHighlight
      style={{flex: 1}}
      fontSize={50}
      onPress={() => {
        if (!addItemOpen) {
          removeGrocery(grocery.id);
        }
      }}
      underlayColor={'transparent'}>
      <Animated.View
        style={[
          styles.container2,
          // {
          //   opacity: this.state.removeId === grocery.id ? this.itemX : 1,
          // },
        ]}>
        <View style={{flex: 1, paddingLeft: '5%'}}>
          {detailsOpen ? (
            <View>
              <GroceryForm
                closeGroceryForm={() => toggleDetails(!detailsOpen)}
                addGrocery={updateGrocery}
                item={grocery}
                shouldCloseOnSubmit={true}
              />
            </View>
          ) : (
            <View style={styles.textInfo}>
              <Text style={textStyles.default}>{grocery.name}</Text>
              <Text style={textStyles.groceryDetails}>{grocery.quantity}</Text>
              <Text style={textStyles.groceryDetails}>{grocery.unit}</Text>
            </View>
          )}
        </View>
        <Animated.View>
          <Icon
            size={32}
            name={detailsOpen ? 'expand-less' : 'expand-more'}
            color="black"
            onPress={() => {
              if (!addItemOpen) {
                toggleDetails(!detailsOpen);
              }
            }}
          />
        </Animated.View>
      </Animated.View>
    </TouchableHighlight>
  );
}

export default function GroceriesContainer(props) {
  const {data, loading, error, refetch, networkStatus} = useQuery(
    queries.GET_GROCERY_LIST_ITEMS,
    {
      variables: {list: props.listId},
      notifyOnNetworkStatusChange: true,
    },
  );

  if (loading) return <Text>loading...</Text>;
  if (error) console.log(error);

  return (
    <View style={{flex: 1}}>
      <View style={styles.groceries}>
        {data &&
        data.getGroceryListItems &&
        data.getGroceryListItems.length > 0 ? (
          <KeyboardAwareFlatList
            //ref="flatList" //! USE TO ADJUST LIST WHEN ADDING ITEMS. BEHAVIOR IS NOT OPTIMAL.
            //onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
            contentContainerStyle={{marginBottom: 10}}
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={networkStatus === 4}
                onRefresh={() => refetch()}
                tintColor={colors.primaryColor}
              />
            }
            data={data.getGroceryListItems}
            renderItem={({item}) => (
              <GroceryItem
                grocery={item}
                addItemOpen={props.addItemOpen}
                removeGrocery={() => {}}
                showGroceryForm={() => {}}
                updateGrocery={() => {}}
              />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="always"
          />
        ) : (
          <EmptyListInfo emoji={props.addItemOpen ? '😃' : '🥺'} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groceries: {
    position: 'absolute',
    top: '-9%',
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
});

GroceriesContainer.propTypes = {};
