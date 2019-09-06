import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import GlobalStyles from '../assets/styles/StyleSheet';
import Menu, { MenuItem } from 'react-native-material-menu';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';

class HeaderMenu extends React.Component {
  state = {
    is_modal_visible: false,
  };

  menu = null;

  setMenuRef = ref => {
    this.menu = ref;
  };

  hideMenu = () => {
    this.menu.hide();
  };

  handleChangePassword = () => {
    const { navigate } = this.props;
    navigate('ChangePassword');
    this.menu.hide();
  };

  logout = () => {
    const { navigate } = this.props;
    navigate('Login');
    this.menu.hide();
  };

  showMenu = () => {
    this.menu.show();
  };

  render() {
    return (
      <>
        <TouchableOpacity onPress={this.showMenu}>
          <Icon name="more-vert" color="#fff" />
        </TouchableOpacity>

        <Menu ref={this.setMenuRef} button={<></>}>
          <MenuItem
            onPress={this.handleChangePassword}
            textStyle={GlobalStyles.menuText}
          >
            <VectorIcon name="lock" size={12} color="#808080" />
            <Text> Change Password</Text>
          </MenuItem>
          <MenuItem onPress={this.logout} textStyle={GlobalStyles.menuText}>
            <VectorIcon name="exit-to-app" size={12} color="#808080" />
            <Text> Logout</Text>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default HeaderMenu;
