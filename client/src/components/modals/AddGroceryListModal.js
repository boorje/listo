import React from 'react';
import {StyleSheet, Modal, TouchableOpacity, TextInput} from 'react-native';

class AddGroceryListModal extends React.Component {
  state = {
    input: '',
  };

  render() {
    const input = this.state;
    return (
      <Modal animationType="fade" transparent={true} visible={true}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.props.closeModal()}
          activeOpacity={1}>
          <TextInput
            placeholder={this.props.placeholder}
            placeholderTextColor="white"
            returnKeyType="done"
            enablesReturnKeyAutomatically={true}
            autoFocus={true}
            onSubmitEditing={() => {
              this.props.addGroceryList(this.state.input);
              this.props.closeModal();
            }}
            onChangeText={text => this.setState({input: text})}
            style={{
              height: 50,
              color: 'white',
              fontSize: 40,
            }}
          />
        </TouchableOpacity>
      </Modal>
    );
  }
}

export default AddGroceryListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});
