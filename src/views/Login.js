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

export default class Login extends Component {
  render() {
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
                underlineColorAndroid="transparent"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                alert('dssdf');
              }}
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
