import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {useMutation, useQuery} from '@apollo/react-hooks';
// styles
import * as colors from '../styles/colors';
import textStyles from '../styles/textStyles';
// api
import * as queries from '../api/queries';
import * as mutations from '../api/mutations';

// TODO: Move icon logic to screenheader instead of parent. Provide different cases
export default function ScreenHeader(props) {
  const [textInputActive, setTextInputActive] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');

  const {
    data: {list},
    loading: fetchingList,
    error: listError,
  } = useQuery(queries.GET_ACTIVE_LIST);

  if (fetchingList) console.log('Fetching list..');
  if (listError) console.log('LISTERRORFETCH: ', listError);
  if (textInputValue.length < 1 && list && !textInputActive)
    setTextInputValue(list.title);

  const [updateListTitle] = useMutation(mutations.UPDATE_LIST_TITLE, {
    onError() {
      console.log('Could not update title.'); // TODO: UI for user
    },
    onCompleted({updateListTitle: updatedList}) {
      setTextInputValue(updatedList.list.title);
    },
  });

  return (
    <LinearGradient colors={colors.testShade} style={styles.container}>
      <View style={styles.container2}>
        <View style={{flex: 1}}>
          <IoniconsIcon
            style={styles.iconStyle}
            size={50}
            color={'white'}
            name={props.leftIcon}
            onPress={() => props.leftIconPress()}
          />
        </View>
        {!textInputActive ? (
          <TouchableHighlight
            underlayColor={'transparent'}
            style={styles.headerTitle}
            disabled={!list.isOwner}
            onPress={() => {
              if (list.isOwner) {
                setTextInputActive(true);
              }
            }}>
            <View>
              <Text style={[textStyles.listTitle]}>{textInputValue}</Text>
              {/* <Text style={[textStyles.listTitle]}>{groceryList.owner}</Text> */}
            </View>
          </TouchableHighlight>
        ) : (
          <TextInput
            value={textInputValue}
            onChangeText={text => setTextInputValue(text)}
            onSubmitEditing={() => {
              updateListTitle({
                variables: {
                  input: {id: list.id, title: textInputValue},
                },
              });
              setTextInputActive(false);
            }}
            placeholder="List name..."
            returnKeyType="done"
            placeholderTextColor="white"
            autoCapitalize="none"
            autoFocus={true}
            style={textStyles.listTitle}
          />
        )}

        <View style={styles.rightIcons}>
          {props.rightIcon1 && (
            <IoniconsIcon
              style={[styles.iconStyle, {paddingRight: '15%'}]}
              size={35}
              color={'white'}
              name={props.rightIcon1}
              onPress={() => props.rightIcon1Press()}
            />
          )}
          {props.rightIcon2 && (
            <IoniconsIcon
              style={styles.iconStyle}
              size={35}
              color={'white'}
              name={props.rightIcon2}
              onPress={() => props.rightIcon2Press()}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 0,
    backgroundColor: colors.primaryColor,
    height: '20%',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    paddingBottom: '3%',
    position: 'absolute',
  },
  headerTitle: {
    flex: 5,
    alignItems: 'center',
  },
  iconStyle: {
    paddingRight: '10%',
  },
  rightIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

ScreenHeader.propTypes = {
  leftIcon: PropTypes.string,
  leftIconPress: PropTypes.func,
  rightIcon1: PropTypes.string,
  rightIcon1Press: PropTypes.func,
  rightIcon2: PropTypes.string,
  rightIcon2Press: PropTypes.func,
};
