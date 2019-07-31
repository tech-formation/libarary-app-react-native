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
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import { showToast } from '../utils/helper';
import Menu, { MenuItem } from 'react-native-material-menu';

export default class Scan extends Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  static _menu = null;

  static setMenuRef = ref => {
    this._menu = ref;
  };

  static hideMenu = () => {
    this._menu.hide();
  };

  static showMenu = () => {
    this._menu.show();
  };

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
          <TouchableOpacity onPress={this.showMenu}>
            <Icon name="more-vert" color="#fff" />
          </TouchableOpacity>
          <Menu ref={this.setMenuRef}>
            <MenuItem onPress={this.hideMenu} textStyle={GlobalStyles.menuText}>
              <VectorIcon name="lock" size={12} color="#808080" />
              <Text> Change Password</Text>
            </MenuItem>
            <MenuItem onPress={this.hideMenu} textStyle={GlobalStyles.menuText}>
              <VectorIcon name="exit-to-app" size={12} color="#808080" />
              <Text> Logout</Text>
            </MenuItem>
          </Menu>
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
