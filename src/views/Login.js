import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './Home';
import ScanShelf from './ScanShelf';
import Scan from './Scan';
import { LOGIN_API_URL } from '../configs/constants';
import { httpPost } from '../utils/http';
import AsyncStorage from '@react-native-community/async-storage';

// To see all the requests in the chrome Dev tools in the network tab.
XMLHttpRequest = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;

// fetch logger
global._fetch = fetch;
global.fetch = function(uri, options, ...args) {
  return global._fetch(uri, options, ...args).then(response => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
  });
};

class Login extends Component {
  static navigationOptions = { header: null };

  /**
   * State
   */
  state = {
    username: '',
    password: '',
  };

  saveLoggedInUserInfo = async (token, user) => {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', user);
    } catch (e) {
      console.log(e);
    }
    console.log('Done.');
  };

  handleLoginRequest = () => {
    const { username, password } = this.state;

    if (password.length < 6) {
      Alert.alert('The password must be at least 6 characters.');
      return;
    }

    const params = { username, password };

    httpPost(LOGIN_API_URL, params)
      .then(res => {
        const { navigate } = this.props.navigation;
        this.saveLoggedInUserInfo(res.token, res.user);
        navigate('Home');
      })
      .catch(err => {
        Alert.alert(err.error);
      });
  };

  render() {
    const { username, password } = this.state;

    return (
      <View style={GlobalStyles.mainContainer}>
        <View style={GlobalStyles.contentContainer}>
          <View style={GlobalStyles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={GlobalStyles.logoImage}
            />
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/images/ico-email.png')} //Change your icon image here
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Username"
                value={username}
                autoCapitalize="none"
                onChangeText={value => {
                  this.setState({ username: value });
                }}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/images/ico-password.png')} //Change your icon image here
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.textInput}
                placeholder="Password"
                value={password}
                secureTextEntry={true}
                autoCompleteType="password"
                onChangeText={value => {
                  this.setState({ password: value });
                }}
                underlineColorAndroid="transparent"
              />
            </View>
            <TouchableOpacity
              onPress={this.handleLoginRequest}
              style={GlobalStyles.button}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>LOGIN</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textInput: {
    flex: 1,
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#a9a9a9',
    height: 40,
    margin: 10,
  },

  inputIcon: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
});

const MainNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Home: { screen: Home },
    Scan: { screen: Scan },
    ScanShelf: { screen: ScanShelf },
  },
  {
    initialRouteName: 'ScanShelf',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#8c1d1a',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const App = createAppContainer(MainNavigator);

export default App;
