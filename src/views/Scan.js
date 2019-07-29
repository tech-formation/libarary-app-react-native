import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';

export default class Scan extends Component {
  state = {
    shelf_no: '',
  };

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

  /**
   * Handles scan shelf
   */
  scanShelf = () => {
    const { shelf_no } = this.state;
    const {
      navigation: { navigate },
    } = this.props;

    if (!shelf_no) {
      Alert.alert('Please enter shelf no to scan.');
      return;
    }

    navigate('ScanShelf', {
      shelf_no,
    });
  };

  render() {
    const { shelf_no } = this.state;

    return (
      <View>
        <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
          <TextInput
            placeholder="Enter Shelf Number"
            underlineColorAndroid="transparent"
            style={[styles.textInput]}
            autoCapitalize="none"
            value={shelf_no}
            onChangeText={value => {
              this.setState({ shelf_no: value });
            }}
          />
          <Button
            onPress={() => this.scanShelf()}
            title="Scan"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
  },
  textInput: {},
});
