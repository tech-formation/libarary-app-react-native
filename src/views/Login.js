import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Icon,
} from 'react-native';

export default class Login extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
            />
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/images/ico-email.png')} //Change your icon image here
                style={styles.inputIcon}
              />

              <TextInput
                style={{ flex: 1 }}
                placeholder="Username"
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                source={require('../assets/images/ico-password.png')} //Change your icon image here
                style={styles.inputIcon}
              />

              <TextInput
                style={{ flex: 1 }}
                placeholder="Password"
                underlineColorAndroid="transparent"
              />
            </View>
            <TouchableOpacity
              onPress={this._onPressButton}
              style={styles.loginButton}
            >
              <View>
                <Text style={styles.loginText}>LOGIN</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: 300,
    height: 400,
  },
  logoContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  formContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'pink',
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
  loginButton: {
    // flex: 0.3,
    backgroundColor: '#8c1d1a',
    width: 200,
    height: 40,
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  loginText: {
      color: '#fff',
  }
});
