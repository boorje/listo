import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import TaskContainer from '../components/taskContainer';
import AddTask from '../components/addTask';
import AddTaskModal from '../components/addTaskModal';
import {Input} from 'react-native-elements';

class HomeScreen extends React.Component {
  state = {
    modalOpen: false,
    lists: ['Adam', 'Eric', 'Simon'],
  };
  static navigationOptions = {
    headerTitle: 'Mina listor',
  };

  showModal = () => {
    if (this.state.modalOpen === false) {
      this.setState({modalOpen: true});
    } else {
      this.setState({modalOpen: false});
    }
  };

  addTask = task => {
    this.setState({lists: [...this.state.lists, task]});
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.modalOpen && (
          <AddTaskModal
            closeModal={() => this.showModal()}
            placeholder="Lägg till lista..."
            addTask={task => this.addTask(task)}
          />
        )}
        <ScrollView>
          <TaskContainer
            lists={this.state.lists}
            selectTask={() => this.props.navigation.navigate('List')}
          />
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
