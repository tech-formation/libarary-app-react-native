import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFS from 'react-native-fs';
import { NavigationEvents } from 'react-navigation';

export default class Home extends Component {
  static navigationOptions = { header: null };

  state = {
    is_loading: false,
  };

  getDb = async () => {
    this.setState({ is_loading: true });
    const { navigate } = this.props.navigation;

    if (!global.db) {
      var path = RNFS.DocumentDirectoryPath + '/library_db.json';
      global.db = [];
      await RNFS.readFile(path)
        .then(data => {
          global.db = JSON.parse(data);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    }

    this.setState({ is_loading: false });

    if (!global.db) {
      navigate('Login');
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { is_loading } = this.state;

    return (
      <>
        <NavigationEvents onDidFocus={() => this.getDb()} />

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
              <View>
                <Text style={GlobalStyles.largeText}>Books Organizer</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigate('BookDetail');
                }}
                style={GlobalStyles.button}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>SCAN A BOOK</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigate('ScanShelf');
                }}
                style={GlobalStyles.button}
              >
                <Text style={GlobalStyles.buttonText}>SCAN A RACK</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
