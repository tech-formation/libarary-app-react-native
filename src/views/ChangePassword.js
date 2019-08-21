import React, { Component } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import AsyncStorage from '@react-native-community/async-storage';
import { showToast } from '../utils/helper';
import { httpPost } from '../utils/http';
import { CHANGE_PASSWORD_URL } from '../configs/constants';
import Spinner from 'react-native-loading-spinner-overlay';

export default class ChangePassword extends Component {
  state = {
    is_loading: false,
    token: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
  };

  static navigationOptions = {
    title: 'Change Password',
  };

  componentDidMount() {
    this.getToken();
  }

  resetForm = () => {
    this.setState({
      old_password: '',
      new_password: '',
      confirm_password: '',
    });
  };

  getToken = async () => {
    const { navigate } = this.props.navigation;
    const token = await AsyncStorage.getItem('token');

    if (token != null) {
      this.setState({ token });
    } else {
      navigate('Login');
    }
  };

  handleChangePasswordRequest = () => {
    const { old_password, new_password, confirm_password, token } = this.state;

    if (old_password.length < 6) {
      showToast('Old password must be at least 6 characters');
      return;
    }

    if (new_password.length < 6) {
      showToast('New password must be at least 6 characters');
      return;
    }

    if (new_password != confirm_password) {
      showToast('Confirm password did not match');
      return;
    }

    this.setState({ is_loading: true });

    const params = { old_password, new_password };

    httpPost(CHANGE_PASSWORD_URL, params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const { message } = res;
        this.setState({ is_loading: false });
        setTimeout(() => showToast(message), 100);
        this.resetForm();
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err.error.message), 100);
      });
  };

  render() {
    const {
      old_password,
      new_password,
      confirm_password,
      is_loading,
    } = this.state;

    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />

        <View style={styles.container}>
          <View>
            <Text style={GlobalStyles.largeText}>Change Password</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={old_password}
                placeholder="Old Password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={value => {
                  this.setState({ old_password: value });
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
                value={new_password}
                onChangeText={value => {
                  this.setState({ new_password: value });
                }}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={confirm_password}
                placeholder="Confirm Password"
                secureTextEntry={true}
                autoCompleteType="password"
                onChangeText={value => {
                  this.setState({ confirm_password: value });
                }}
                underlineColorAndroid="transparent"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={this.handleChangePasswordRequest}
              style={styles.button}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>Change Password</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </>
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
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
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
