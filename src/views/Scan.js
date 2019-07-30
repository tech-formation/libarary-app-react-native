import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import { Icon } from 'react-native-elements';
import Menu from '../components/Menu';

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
        <TouchableOpacity onPress={this._onPressButton}>
          <Icon name="more-vert" color="#fff" />
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
      <>
        <View style={styles.mainContainer}>
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
            <TouchableOpacity onPress={() => this.scanShelf()}>
              <Icon name="send" color="#8c1d1a" />
            </TouchableOpacity>
          </View>
        </View>
        {false && <Menu />}
      </>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
  },
  textInput: {},
});
