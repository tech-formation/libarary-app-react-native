import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import AsyncStorage from '@react-native-community/async-storage';
import { showToast } from '../utils/helper';

export default class Home extends Component {
  static navigationOptions = { header: null };

  state = {
    token: '',
    backClickCount: 0,
  };

  componentDidMount() {
    this.getToken();

    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButton.bind(this)
    // );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this)
    );
  }

  timeout() {
    showToast('Press back again to exit the app');
    this.setState({ backClickCount: 1 });
    setTimeout(() => this.setState({ backClickCount: 0 }), 1000);
  }

  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this.timeout();

    return true;
  };

  getToken = async () => {
    const { navigate } = this.props.navigation;
    try {
      const token = await AsyncStorage.getItem('token');
      if (token != null) {
        this.setState({ token });
      } else {
        navigate('Login');
      }
    } catch (e) {
      // showToast(e);
    }
  };

  render() {
    const { navigate } = this.props.navigation;

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
            <View>
              <Text style={GlobalStyles.largeText}>Books Organizer</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigate('Scan', { type: 'book' })}
              style={GlobalStyles.button}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>SCAN A BOOK</Text>
              </View>
            </TouchableOpacity>
            <View style={GlobalStyles.verticalSpace} />
            <TouchableOpacity
              onPress={() => navigate('Scan', { type: 'shelf' })}
              style={GlobalStyles.button}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>SCAN A SHELF</Text>
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
