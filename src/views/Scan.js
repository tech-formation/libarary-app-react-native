import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import { Icon } from 'react-native-elements';
import { showToast } from '../utils/helper';
import HeaderMenu from '../components/HeaderMenu';

export default class Scan extends Component {
  static navigationOptions = ({ navigation }) => {
    const {
      state: {
        params: { type },
      },
      navigate,
    } = navigation;

    return {
      headerRight: (
        <View style={GlobalStyles.headerRightContainer}>
          <TouchableOpacity
            onPress={() =>
              navigate('Scan', { type: type == 'shelf' ? 'book' : 'shelf' })
            }
            style={GlobalStyles.headerRightButton}
          >
            <View>
              <Text style={GlobalStyles.buttonText}>
                Scan a {type == 'shelf' ? 'Book' : 'Shelf'}
              </Text>
            </View>
          </TouchableOpacity>

          <HeaderMenu navigate={navigate} />
        </View>
      ),
    };
  };

  state = {
    number: '',
  };

  /**
   * Handles scan shelf
   */
  scanEntity = () => {
    const { number } = this.state;

    const {
      navigation,
      navigation: { navigate },
    } = this.props;

    const type = navigation.getParam('type');

    if (!number) {
      showToast(`Please enter ${type} no to scan.`);
      return;
    }
    if (type == 'book') {
      navigate('BookDetail', { number });
    } else {
      navigate('ScanShelf', { number });
    }
  };

  render() {
    const { navigation } = this.props;
    const { number } = this.state;
    const type = navigation.getParam('type');

    return (
      <>
        <View style={styles.mainContainer}>
          <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
            <TextInput
              placeholder={`Enter ${type == 'book' ? 'Book' : 'Shelf'}  Number`}
              underlineColorAndroid="transparent"
              style={[styles.textInput]}
              autoCapitalize="none"
              value={number}
              onChangeText={value => {
                this.setState({ number: value });
              }}
            />
            <TouchableOpacity onPress={() => this.scanEntity()}>
              <Icon name="send" color="#8c1d1a" />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'space-between',
  },
});
