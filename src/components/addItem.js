import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import ItemDetails from '../components/itemDetails';
import textStyles from '../styles/textStyles';

class AddItem extends React.Component {
  state = {
    addItem: false,
  };

  showDetails = () => {
    if (this.state.addItem === false) {
      LayoutAnimation.spring();
      this.setState({addItem: true});
    } else {
      LayoutAnimation.spring();
      this.setState({addItem: false});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.state.addItem ? (
          <TouchableOpacity onPress={() => this.showDetails()}>
            <Text style={textStyles.default}>Lägg till vara</Text>
          </TouchableOpacity>
        ) : (
          <ItemDetails
            closeDetails={() => this.showDetails()}
            addItem={item => this.props.addItem(item)}
          />
        )}

        <View style={{flexDirection: 'row'}}>
          <IoniconsIcon
            size={32}
            name={'ios-camera'}
            color={'black'}
            onPress={() => {}}
          />
          <IoniconsIcon
            size={32}
            name={'md-images'}
            color={'black'}
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }
}

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '3%',
    paddingRight: '3%',
    marginTop: '3%',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Avenir Next',
  },
});
