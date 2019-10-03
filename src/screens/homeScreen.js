import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import TaskContainer from '../components/taskContainer';
import AddTask from '../components/addTask';
import AddTaskModal from '../components/addTaskModal';

class HomeScreen extends React.Component {
  state = {
    modalOpen: false,
  };
  static navigationOptions = {
    title: 'Home',
  };

  showModal = () => {
    if (this.state.modalOpen === false) {
      this.setState({modalOpen: true});
    } else {
      this.setState({modalOpen: false});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.modalOpen && (
          <AddTaskModal
            closeModal={() => this.showModal()}
            placeholder="Lägg till lista..."
          />
        )}
        <ScrollView>
          <TaskContainer />
          <AddTask addTask={() => this.showModal()} />
        </ScrollView>
      </View>
    );
  }
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headline: {
    height: '5%',
    backgroundColor: 'blue',
  },
});
