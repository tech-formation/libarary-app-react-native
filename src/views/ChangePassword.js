import React, { Component } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';

export default class ChangePassword extends Component {
  static navigationOptions = {
    title: 'Change Password',
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={GlobalStyles.largeText}>Change Password</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Old Password"
              autoCapitalize="none"
              onChangeText={value => {
                this.setState({ username: value });
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="New Password"
              secureTextEntry={true}
              autoCompleteType="password"
              onChangeText={value => {
                this.setState({ password: value });
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
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
            style={styles.button}
          >
            <View>
              <Text style={GlobalStyles.buttonText}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  menu: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
  },
  menuIcon: {
    paddingRight: 8,
  },
  menuItemInner: {
    display: 'flex',
    flexDirection: 'row',
  },
  formContainer: {
    height: 230,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
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
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#8c1d1a',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
});
