import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {Auth} from 'aws-amplify';

import TaskContainer from '../components/taskContainer';
import AddTask from '../components/addTask';
import AddTaskModal from '../components/addTaskModal';

class HomeScreen extends React.Component {
  state = {
    modalOpen: false,
    tasks: ['Adam', 'Eric', 'Simon'],
  };
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: 'Mina listor',
      headerRight: (
        <IoniconsIcon
          size={32}
          name="md-settings"
          onPress={async () => {
            try {
              await Auth.signOut();
              navigation.navigate('Auth');
            } catch (error) {
              console.log(error);
            }
          }}
          style={{marginRight: 15}}
        />
      ),
    };
  };

  showModal = () => {
    if (this.state.modalOpen === false) {
      this.setState({modalOpen: true});
    } else {
      this.setState({modalOpen: false});
    }
  };

  addTask = task => {
    this.setState({tasks: [...this.state.tasks, task]});
  };

  removeTask = index => {
    const tasksCopy = this.state.tasks;
    tasksCopy.splice(index, 1);
    this.setState({tasks: tasksCopy});
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
            lists={this.state.tasks}
            removeTask={index => this.removeTask(index)}
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
