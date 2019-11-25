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
import {useQuery, useMutation} from '@apollo/react-hooks';
// components
import Swipeout from '../components/swipeout';
import textStyles from '../styles/textStyles';
import * as colors from '../styles/colors';
// api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';

function GroceryListItem(props) {
  const [viewWidth, setViewWidth] = useState(0);
  return (
    <View
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setViewWidth(width);
      }}
      style={[GroceryListItemStyles.container]}
      underlayColor="transparent"
      fontSize={50}>
      <Swipeout
        list={props.item}
        user={props.user}
        swipeoutEnabled={true}
        disableScroll={() => {}}
        enableScroll={() => {}}
        viewWidth={viewWidth}
        delete={() => props.removeGroceryList(props.item.id)}>
        <TouchableWithoutFeedback
          onPress={() => props.goToGroceryList(props.item)}>
          <View style={GroceryListItemStyles.container2}>
            <Text style={textStyles.default}>{props.item.title}</Text>
            {/* {this.props.isShared && (
                    <Icon size={30} name={'people'} color={'black'} />
                  )} */}
          </View>
        </TouchableWithoutFeedback>
      </Swipeout>
    </View>
  );
}

export default function GroceryListsContainerHook(props) {
  const [user] = useState({
    id: '9cd866c9-02cc-4d93-aef6-28dfc28392a3',
    email: 'eric.borjesson@hotmail.com',
  });
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
        variables: {owner: user.id},
      });
      cache.writeQuery({
        query: queries.GET_USERS_LISTS,
        variables: {owner: user.id},
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

  if (loading) return <Text>loading...</Text>;
  if (error) console.log(error);

  return data && data.getUserGroceryLists ? (
    <KeyboardAwareFlatList
      style={{paddingTop: '3%'}}
      data={data ? data.getUserGroceryLists : []}
      renderItem={({item}) => (
        <GroceryListItem
          user={props.user}
          //isShared={list.owner === props.user.id ? true : false} // TODO: When possible, adjust
          item={item}
          goToGroceryList={props.goToGroceryList}
          numberOfItems={props.numberOfItems}
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

const GroceryListItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondaryColor,
    width: '97%',
    marginLeft: '3%',
    marginBottom: '3%',
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 1,
    shadowOpacity: 0.5,
  },
  container2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  swipeout: {
    backgroundColor: 'transparent',
    marginBottom: '2%',
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06BA63',
    borderRadius: 50,
    width: 30,
    height: 30,
  },
});

GroceryListsContainerHook.propTypes = {
  goToGroceryList: PropTypes.func.isRequired,
};