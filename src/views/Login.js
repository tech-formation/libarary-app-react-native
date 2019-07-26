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

class Login extends Component {
  static navigationOptions = { header: null };

  render() {
    const {
      navigation: { navigate },
    } = this.props;
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
            <View style={GlobalStyles.inputContainer}>
              <Image
                source={require('../assets/images/ico-email.png')}
                style={GlobalStyles.inputIcon}
              />

              <TextInput
                style={GlobalStyles.textInput}
                placeholder="Username"
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={GlobalStyles.inputContainer}>
              <Image
                source={require('../assets/images/ico-password.png')}
                style={GlobalStyles.inputIcon}
              />

              <TextInput
                style={GlobalStyles.textInput}
                placeholder="Password"
                underlineColorAndroid="transparent"
              />
            </View>
            <TouchableOpacity
              onPress={() => navigate('Home')}
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
});

const MainNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Home: { screen: Home },
    ScanShelf: { screen: ScanShelf },
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
