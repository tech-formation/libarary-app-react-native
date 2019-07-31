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
import Menu from '../components/Menu';
import { showToast } from '../utils/helper';

export default class Scan extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  state = {
    shelf_no: '',
    show_menu: false,
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
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
          <TouchableOpacity onPress={() => params.handleMenuClick()}>
            <Icon name="more-vert" color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handleMenuClick: this.toggleMenu,
    });
  }

  toggleMenu() {
    this.setState({ show_menu: !this.state.show_menu });
  }

  /**
   * Handles scan shelf
   */
  scanShelf = () => {
    const { shelf_no } = this.state;
    const {
      navigation: { navigate },
    } = this.props;

    if (!shelf_no) {
      showToast('Please enter shelf no to scan.');
      return;
    }

    navigate('ScanShelf', {
      shelf_no,
    });
  };

  render() {
    const { shelf_no, show_menu } = this.state;

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
        {show_menu && <Menu />}
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
