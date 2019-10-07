import React from 'react';
import {Button, StyleSheet, View, ScrollView} from 'react-native';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Amplify, {API, Auth, graphqlOperation} from 'aws-amplify';

// -- Components --
import TaskContainer from '../components/taskContainer';
import AddTask from '../components/addTask';
import AddTaskModal from '../components/addTaskModal';

// -- Mutations --
import * as mutations from '../graphql/mutations';

class HomeScreen extends React.Component {
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

  state = {
    modalOpen: false,
    tasks: ['Adam', 'Eric', 'Simon'],
  };

  addItem = async () => {
    try {
      const newListInput = {title: 'testlista'};
      //! owner not auto populating
      const newList = await API.graphql(
        graphqlOperation(mutations.createGroceryList, {input: newListInput}),
      );
      console.log(newList);
    } catch (error) {
      console.log(error);
    }
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
          <Button title="ADD ITEM" onPress={() => this.addItem()} />
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
