import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from './Home';
import ScanShelf from './ScanShelf';
import Scan from './Scan';
import { LOGIN_API_URL } from '../configs/constants';
import { httpPost } from '../utils/http';
import AsyncStorage from '@react-native-community/async-storage';
import { showToast } from '../utils/helper';
import BookDetail from './BookDetail';
import ChangePassword from './ChangePassword';
import Spinner from 'react-native-loading-spinner-overlay';

// // To see all the requests in the chrome Dev tools in the network tab.
// XMLHttpRequest = GLOBAL.originalXMLHttpRequest
//   ? GLOBAL.originalXMLHttpRequest
//   : GLOBAL.XMLHttpRequest;

// fetch logger
// global._fetch = fetch;
// global.fetch = function(uri, options, ...args) {
//   return global._fetch(uri, options, ...args).then(response => {
//     console.log('Fetch', { request: { uri, options, ...args }, response });
//     return response;
//   });
// };

class Login extends Component {
  static navigationOptions = { header: null };

  /**
   * State
   */
  state = {
    is_loading: false,
    username: 'admin',
    password: '53cret!@#$',
  };

  saveLoggedInUserInfo = async (token, user) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      // showToast(e);
    }
  };

  handleLoginRequest = () => {
    const { username, password } = this.state;

    if (!username || !password) {
      showToast('Please enter username & password.');
      return;
    }

    if (password.length < 6) {
      showToast('The password must be at least 6 characters.');
      return;
    }

    this.setState({ is_loading: true });
    const params = { username, password };

    httpPost(LOGIN_API_URL, params)
      .then(res => {
        const { navigate } = this.props.navigation;
        this.saveLoggedInUserInfo(res.token, res.user);
        this.setState({ is_loading: false });
        navigate('Home');
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err.error), 100);
      });
  };

  render() {
    const { username, password, is_loading } = this.state;

    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />

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
                  blurOnSubmit={false}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.password.focus();
                  }}
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
                  returnKeyType={'done'}
                  onChangeText={value => {
                    this.setState({ password: value });
                  }}
                  ref={input => {
                    this.password = input;
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
      </>
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
    BookDetail: { screen: BookDetail },
    ChangePassword: { screen: ChangePassword },
  },
  {
    initialRouteName: 'Home',
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
