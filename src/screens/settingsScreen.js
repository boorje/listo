import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Auth} from 'aws-amplify';
import Svg, {ClipPath, Circle, Rect} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../styles/textStyles';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import PrimaryButton from '../components/buttons/primaryButton';
import * as colors from '../styles/colors';

const {height, width} = Dimensions.get('window');
class SettingsScreen extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    try {
      const user = await this.props.navigation.getParam('user', null);
      this.setState({user});
    } catch (error) {
      console.log(error);
    }
  };

  _logout = async () => {
    try {
      await Auth.signOut();
      this.props.navigation.navigate('Auth');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {user} = this.state;
    return (
      <View style={styles.container}>
        <IoniconsIcon
          style={styles.backIcon}
          size={50}
          name={'ios-arrow-round-back'}
          color={'white'}
          onPress={() => this.props.navigation.goBack()}
        />
        <View style={styles.emailText}>
          {Object.entries(user).length > 0 && user.constructor === Object && (
            <Text style={textStyles.listTitle}>{user.email}</Text>
          )}
        </View>

        <Svg height={height * 0.4} width={width * 1.5}>
          <ClipPath id="clip">
            <Circle r={height * 0.4} cx={width / 2} />
          </ClipPath>
          <Rect
            width={width}
            height={height * 1.1}
            fill={colors.primaryColor}
            clipPath="url(#clip)"
          />
        </Svg>
        <View style={styles.profileIcon}>
          <Icon size={120} name={'person'} color={colors.primaryColor} />
        </View>

        <View style={styles.logoutButton}>
          <PrimaryButton title="Logga ut" onPress={() => this._logout()} />
        </View>
      </View>
    );
  }
}
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5},
    shadowRadius: 2,
    shadowOpacity: 0.5,
  },
  backIcon: {
    zIndex: 1,
    position: 'absolute',
    marginLeft: '5%',
    marginTop: '10%',
  },
  emailText: {
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: height * 0.2,
  },
  profileIcon: {
    width: width * 0.4,
    height: width * 0.4,
    top: height * 0.4 - width * 0.2,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
  },
  logoutButton: {width: width * 0.7, top: height * 0.3, alignSelf: 'center'},
});
