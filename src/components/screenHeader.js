import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import textStyles from '../styles/textStyles';
import PropTypes from 'prop-types';
import * as colors from '../styles/colors';

function ScreenHeader(props) {
  const [textInputActive, setTextInputActive] = useState(false);
  const [textInputValue, setTextInputValue] = useState(props.headerTitle);
  const [user, setUser] = useState(props.user || {});
  const [groceryList, setGroceryList] = useState(props.groceryList || {});

  useEffect(() => {
    setTextInputValue(props.headerTitle);
  }, [props.headerTitle]);

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  useEffect(() => {
    setGroceryList(props.groceryList);
  }, [props.groceryList]);

  return (
    <View style={styles.container}>
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
            onPress={() => {
              if (user.id === groceryList.owner) {
                console.log('bajs');
                setTextInputActive(true);
              }
            }}>
            <Text style={[textStyles.listTitle]}>{props.headerTitle}</Text>
          </TouchableHighlight>
        ) : (
          <TextInput
            value={textInputValue}
            onChangeText={text => setTextInputValue(text)}
            onSubmitEditing={() => {
              props.renameList(textInputValue);
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
    </View>
  );
}

export default ScreenHeader;

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
  leftIconPress: PropTypes.func.isRequired,
  leftIcon: PropTypes.string.isRequired,
};
