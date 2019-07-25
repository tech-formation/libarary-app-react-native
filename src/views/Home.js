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
import GlobalStyles from '../assets/styles/StyleSheet';

export default class Home extends Component {
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
            
            <View>
              <Text style={GlobalStyles.largeText}>Books Organizer</Text>
            </View>

            <TouchableOpacity
              onPress={this._onPressButton}
              style={GlobalStyles.button}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>SCAN A BOOK</Text>
              </View>
            </TouchableOpacity>
            <View style={GlobalStyles.verticalSpace}></View>
            <TouchableOpacity
              onPress={this._onPressButton}
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
