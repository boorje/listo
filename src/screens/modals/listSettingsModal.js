import React from 'react';
import {
  FlatList,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
// components
import OverlayModal from '../../components/modals/overlayModal';
import Message from '../../components/message';
import AddUser from '../../components/addUser.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeout from '../../components/swipeout';
// api
import {
  createEditor,
  deleteEditor,
  getEditors,
} from '../../api/groceryListsAPI';
import {getUserByEmail} from '../../api/authAPI';
import textStyles from '../../styles/textStyles';

/**
 * TODO:
 * Add Formik
 * Add Stylesheet
 */
export default class ListSettingsModal extends React.Component {
  state = {
    groceryList: this.props.groceryList || {},
    user: this.props.user || {},
    editors: [],
    apiError: '',
    loggedInUserIsListOwner: false,
    fullyOpen: false,
    scrollEnabled: true,
  };

  componentDidMount = async () => {
    try {
      await this.fetchEditors(this.state.groceryList.id);
      const loggedInUserIsListOwner =
        this.state.user.id === this.state.groceryList.owner;
      this.setState({loggedInUserIsListOwner});
    } catch (error) {
      this.setState({
        apiError: error ? error : 'Could not fetch editors. Please try again.',
      });
    }
  };

  fetchEditors = async listId => {
    try {
      const res = await getEditors(listId);
      if (!res || res === null) {
        throw 'Could not fetch editors. Please try again.';
      }
      let editors = [];
      res.editors.items.map(({user}) => {
        editors.push(user);
      });
      editors = await this.addOwnerProp(editors);
      this.setState({editors});
    } catch (error) {
      throw 'Could not fetch editors. Please try again.';
    }
  };

  addOwnerProp = async editors => {
    return await editors.map(editor => {
      if (editor.id === this.state.groceryList.owner) {
        editor.listOwner = true;
      }
      return editor;
    });
  };

  // validates the user input
  validateEmail = email => {
    return new Promise(async (resolve, reject) => {
      try {
        const schema = yup.object().shape({
          email: yup
            .string()
            .email()
            .required(),
        });
        await schema.validate({email});
        resolve();
      } catch (error) {
        const {message} = error;
        reject(message.charAt(0).toUpperCase() + message.slice(1));
      }
    });
  };

  // add editor to the list
  addEditor = async emailInput => {
    try {
      // TODO: check if logged in user is owner of list
      if (!this.state.loggedInUserIsListOwner) {
        throw 'Only the owner of the list can perform add users';
      } else {
        // check for valid user input
        const enteredEmail = emailInput;
        //const enteredEmail = 'adam@olivegren.se';
        await this.validateEmail(enteredEmail);

        // check if the email already exists in the list
        if (this.state.editors.length > 0) {
          this.state.editors.map(({email}) => {
            if (email === enteredEmail) {
              throw 'User already has access to the list.';
            }
          });
        }
        const res = await getUserByEmail(enteredEmail);
        if (!res || res === null) {
          throw 'User does not exist. Please try again.';
        } else if (res.items.length < 1) {
          throw 'User does not exist. Please try again.';
        }
        // checks if the user id already exists
        if (this.state.editors.length > 0) {
          this.state.editors.map(editor => {
            if (editor.id === res.id) {
              throw 'User already has access to the list.';
            }
          });
        }
        const editor = await createEditor({
          editorListId: this.state.groceryList.id,
          editorUserId: res.items[0].id,
        });
        this.setState(prevState => ({
          editors: [...prevState.editors, editor.user],
          emailInput: '',
        }));
      }
    } catch (error) {
      console.log(error);
      this.setState({apiError: error});
    }
  };

  // delete editor from the list
  // TODO: Add so only owner of the list can delete users
  // TODO: Validate that list owner is not deleted
  // TODO: What happens if i delete myself? -> has to be list owner to delete
  deleteEditor = async userId => {
    try {
      if (!this.state.loggedInUserIsListOwner) {
        throw 'Only the owner of the list can remove users.';
      }
      const {editors, groceryList} = this.state;
      const res = await deleteEditor({
        listId: groceryList.id,
        userId,
      });
      if (!res || res === null) {
        throw 'Could not remove user. Please try again.';
      }
      const newEditors = editors.filter(editor => editor.id !== userId);
      this.setState({editors: newEditors});
    } catch (error) {
      this.setState({apiError: error ? error : 'Could not remove the user.'});
    }
  };

  FlatListItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  addUserTextInput = () => {
    return (
      this.state.loggedInUserIsListOwner && (
        <View style={styles.textInput}>
          <AddUser
            expandModal={() => this.setState({fullyOpen: true})}
            addEditor={input => {
              this.addEditor(input);
              this.setState({fullyOpen: false});
            }}
          />
        </View>
      )
    );
  };

  renderList({item}) {
    return (
      <UserItem
        item={item}
        disableScroll={() => {
          this.setState({
            scrollEnabled: false,
          });
        }}
        enableScroll={() => {
          this.setState({
            scrollEnabled: true,
          });
        }}
        deleteEditor={() => this.deleteEditor(item.id)}
        loggedInUserIsListOwner={this.state.loggedInUserIsListOwner}
      />
    );
  }

  render() {
    const {apiError, editors} = this.state;
    return (
      <OverlayModal
        expandModal={this.state.fullyOpen}
        closeModal={this.props.closeModal}
        modalTitle="Listmedlemmar"
        textInputActive={this.state.textInputActive}>
        {apiError.length > 0 && <Message message={apiError} />}
        {editors.length > 0 && (
          <KeyboardAwareFlatList
            scrollEnabled={this.state.scrollEnabled}
            data={editors}
            renderItem={({item}) => {
              return this.renderList({item});
            }}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            keyExtractor={item => item.id}
            ListFooterComponent={this.addUserTextInput}
          />
        )}
      </OverlayModal>
    );
  }
}

class UserItem extends React.Component {
  state = {
    viewWidth: 0,
    viewHeight: 0,
  };
  render() {
    console.log(this.props.item);
    return (
      <View
        onLayout={event => {
          var {height, width} = event.nativeEvent.layout;
          this.setState({viewWidth: width, viewHeight: height});
        }}
        style={styles.item}>
        <Swipeout
          disableScroll={() => this.props.disableScroll()}
          enableScroll={() => this.props.enableScroll()}
          swipeoutEnabled={this.props.item.listOwner ? false : true}
          viewWidth={this.state.viewWidth}
          delete={() => this.props.deleteEditor(this.props.item.id)}>
          <TouchableWithoutFeedback>
            <View style={styles.textAndIcon}>
              <Text style={[textStyles.default, {fontSize: 15}]}>
                {this.props.item.email}
              </Text>
              {this.props.item.listOwner && (
                <Icon size={30} name={'ios-key'} color={'black'} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </Swipeout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {},
  textAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
  },
  textInput: {
    alignItems: 'center',
    marginTop: '10%',
  },
  separator: {
    height: 0.5,
    width: '97%',
    marginLeft: '3%',
    backgroundColor: '#607D8B',
  },
});

ListSettingsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  groceryList: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
};
