import React from 'react';
import {StyleSheet, Text, View, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import textStyles from '../../styles/textStyles';

// -- Components --
import PrimaryButton from '../../components/buttons/primaryButton';

const BACKGROUND_URL =
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80';

class SignedupFinishedScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.background}
          source={{
            uri: BACKGROUND_URL,
          }}
        />
        <View style={styles.successBox}>
          <Text style={textStyles.loginHeadline}>Registreringen lyckades</Text>

          <Icon
            style={{
              alignSelf: 'center',
            }}
            size={140}
            name="check-circle"
            color="#37AE15"
          />

          <PrimaryButton
            title="Kom igång"
            onPress={() => this.props.navigation.navigate('App')}
          />
        </View>
      </View>
    );
  }
}

export default SignedupFinishedScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center'},
  background: {flex: 1, opacity: 0.67},

  successBox: {
    width: '70%',
    height: '40%',
    position: 'absolute',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
});
