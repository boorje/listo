import React, {PureComponent, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import ScreenHeader from '../components/screenHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../styles/textStyles';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import * as colors from '../styles/colors';
import PrimaryButton from '../components/buttons/primaryButton';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import GroceryForm from '../components/forms/groceryForm';
import ExitButton from '../components/exitButton';

function GroceryItem(props) {
  const [detailsOpen, toggleDetails] = useState(false);
  const [selected, select] = useState(false);
  const {addItemOpen, grocery, removeGrocery, updateGrocery} = props;
  return (
    <TouchableHighlight
      style={{flex: 1}}
      fontSize={50}
      onPress={() => {
        select(!selected);
      }}
      underlayColor={'transparent'}>
      <Animated.View style={[styles.container2]}>
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
              toggleDetails(!detailsOpen);
            }}
          />
        </Animated.View>
        {!selected ? (
          <IoniconsIcon
            style={styles.iconStyle}
            size={30}
            color={colors.primaryColor}
            name={'ios-radio-button-off'}
          />
        ) : (
          <IoniconsIcon
            style={styles.iconStyle}
            size={30}
            color={colors.primaryColor}
            name={'ios-radio-button-on'}
          />
        )}
      </Animated.View>
    </TouchableHighlight>
  );
}

export default function ItemSelection(props) {
  const [groceries, setGroceries] = useState([
    {
      id: '1',
      name: 'Cola',
      quantity: 2,
      unit: 'kg',
    },
    {
      id: '2',
      name: 'Fanta',
      quantity: 2,
      unit: 'kg',
    },
    {
      id: '3',
      name: 'Sprite',
      quantity: 2,
      unit: 'kg',
    },
    {
      id: '4',
      name: '7Up',
      quantity: 2,
      unit: 'kg',
    },
  ]);

  function addButton() {
    return (
      <View style={styles.button}>
        <PrimaryButton title="Add" onPress={() => {}} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExitButton exit={() => props.navigation.pop(3)} color={'white'} />
      <ScreenHeader
        leftIconPress={props.navigation.goBack}
        rightIcon1Press={() => {}}
        rightIcon2Press={() => {}}
        headerTitle={'Results'}
        leftIcon={'ios-arrow-round-back'}
      />
      <KeyboardAwareFlatList
        style={{marginTop: 10}}
        scrollEnabled={true}
        data={groceries}
        renderItem={({item}) => (
          <GroceryItem
            grocery={item}
            addItemOpen={() => {}}
            removeGrocery={() => {}}
            showGroceryForm={() => {}}
            updateGrocery={() => {}}
          />
        )}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="always"
        ListFooterComponent={addButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  container2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: '3%',
    paddingRight: '3%',
    paddingBottom: '3%',
    marginRight: -1,
  },
  separator: {
    height: 0.5,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
  textInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: '60%',
    marginTop: '10%',
    alignSelf: 'center',
  },
  iconStyle: {
    marginRight: '1%',
    marginLeft: '3%',
  },
});
