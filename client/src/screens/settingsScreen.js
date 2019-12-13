import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';

// api
import {Auth} from 'aws-amplify';
// components
import PrimaryButton from '../components/buttons/primaryButton';
import Svg, {ClipPath, Circle, Rect} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
// styles
import * as colors from '../styles/colors';
import textStyles from '../styles/textStyles';

const {height, width} = Dimensions.get('window');

export default function SettingsScreen(props) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function defineUser() {
      try {
        await setUser(props.navigation.getParam('user', null));
      } catch (error) {
        console.log(error);
      }
    }
    defineUser();
  }, []);

  async function _logout() {
    try {
      await Auth.signOut();
      props.navigation.navigate('Authenticator');
    } catch (error) {
      props.navigation.navigate('Authenticator');
    }
  }

  return (
    <View style={styles.container}>
      <IoniconsIcon
        style={styles.backIcon}
        size={50}
        name={'ios-arrow-round-back'}
        color={'white'}
        onPress={() => props.navigation.goBack()}
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
        <PrimaryButton title="Sign out" onPress={() => _logout()} />
      </View>
    </View>
  );
}

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
