import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import {useApolloClient, useQuery, useMutation} from '@apollo/react-hooks';
import Icon from 'react-native-vector-icons/MaterialIcons';
// components
import Swipeout from '../components/swipeout';
import LinearGradient from 'react-native-linear-gradient';

// styles
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';
// api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';

const listHeight = 100;

function GroceryListItem(props) {
  const [viewWidth, setViewWidth] = useState(0);
  return (
    <View
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setViewWidth(width);
      }}
      style={[styles.container]}
      underlayColor="transparent"
      fontSize={50}>
      <Swipeout
        swipeOutHeight={listHeight}
        list={props.item}
        user={props.user}
        swipeoutEnabled={true}
        disableScroll={() => {}}
        enableScroll={() => {}}
        viewWidth={viewWidth}
        delete={() => props.removeGroceryList(props.item.id)}>
        <TouchableWithoutFeedback onPress={() => props.goToList(props.item)}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={colors.testShade}
            style={styles.container2}>
            <View style={styles.leftText}>
              <Text
                style={[
                  textStyles.default,
                  {color: 'white', fontWeight: '600'},
                ]}>
                {props.item.title}
              </Text>

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 3,
                }}>
                <Icon
                  size={20}
                  name={'people'}
                  color={'white'}
                  onPress={() => {}}
                />
                <Text
                  style={[
                    textStyles.default,
                    {
                      color: 'white',
                      fontSize: 15,
                      fontWeight: '600',
                      marginLeft: 5,
                    },
                  ]}>
                  {props.item.editorCount}
                </Text>
              </View>
            </View>
            <View style={styles.rightText}>
              <Text
                style={[
                  textStyles.default,
                  {
                    color: 'white',
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}>
                {props.item.itemCount}
              </Text>
              <Text
                style={[textStyles.default, {fontSize: 13, color: 'white'}]}>
                items
              </Text>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Swipeout>
      {props.item.isOwner && (
        <Text
          //TODO: Only show crown when you're the owner
          style={[
            textStyles.default,
            {fontSize: 25, color: 'white'},
            styles.leftCorner,
          ]}>
          👑
        </Text>
      )}
    </View>
  );
}

GroceryListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    itemCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default function GroceryListsContainer(props) {
  const client = useApolloClient();
  const {data, loading, error, refetch, networkStatus} = useQuery(
    queries.GET_USERS_LISTS,
    {
      variables: {owner: props.user.id},
      notifyOnNetworkStatusChange: true,
    },
  );

  const [deleteList] = useMutation(mutations.DELETE_GROCERY_LIST, {
    update(cache, {data}) {
      const {getUserGroceryLists} = cache.readQuery({
        query: queries.GET_USERS_LISTS,
        variables: {owner: props.user.id},
      });
      cache.writeQuery({
        query: queries.GET_USERS_LISTS,
        variables: {owner: props.user.id},
        data: {
          getUserGroceryLists: getUserGroceryLists.filter(
            list => list.id !== data.deleteGroceryList.list.id,
          ),
        },
      });
    },
    onError(error) {
      console.log('ERROR\n ', error);
    },
  });

  if (error) console.log('fetch lists error: ', error);

  function goToList(list) {
    const {id, title} = list;
    client.writeData({
      data: {
        list: {
          __typename: 'GroceryList',
          id,
          title,
        },
      },
    });

    props.goToList(list);
  }

  return data && data.getUserGroceryLists ? (
    <KeyboardAwareFlatList
      style={{paddingTop: '5%'}}
      data={data.getUserGroceryLists}
      renderItem={({item}) => (
        <GroceryListItem
          goToList={goToList}
          user={props.user}
          item={item}
          removeGroceryList={id => deleteList({variables: {id}})}
        />
      )}
      keyExtractor={list => list.id}
      refreshControl={
        <RefreshControl
          refreshing={networkStatus === 4}
          tintColor={colors.primaryColor}
          onRefresh={() => !loading && refetch()}
        />
      }
    />
  ) : (
    <Text>You don't have any lists yet.</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '97%',
    height: listHeight,
    marginLeft: '3%',
    marginBottom: '5%',
    borderRadius: 30,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.3,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: listHeight,
    width: '100%',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    overflow: 'hidden',
  },
  leftCorner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    left: -5,
  },
  leftText: {
    position: 'absolute',
    padding: 20,
  },
  rightText: {
    position: 'absolute',
    top: '25%',
    right: '10%',
    alignItems: 'center',
  },
});

GroceryListsContainer.propTypes = {
  goToList: PropTypes.func.isRequired,
  user: PropTypes.shape({id: PropTypes.string.isRequired}).isRequired,
};
