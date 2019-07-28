import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';

export default class ScanShelf extends Component {
  static navigationOptions = {
    headerRight: (
      <View style={GlobalStyles.headerRightContainer}>
        <TouchableOpacity
          onPress={this._onPressButton}
          style={GlobalStyles.headerRightButton}
        >
          <View>
            <Text style={GlobalStyles.buttonText}>Scan a Book</Text>
          </View>
        </TouchableOpacity>
      </View>
    ),
  };

  render() {
    return (
      <View>
        <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
          <TextInput
            placeholder="Enter Shelf Number"
            underlineColorAndroid="transparent"
            style={[styles.textInput]}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'flex-start',
  },
  textInput: {},
});
