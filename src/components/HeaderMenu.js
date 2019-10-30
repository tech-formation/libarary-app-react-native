import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import GlobalStyles from '../assets/styles/StyleSheet';
import Menu, { MenuItem } from 'react-native-material-menu';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import { httpGet } from '../utils/http';
import { SYNC_DATA } from '../configs/constants';
import { showToast } from '../utils/helper';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

class HeaderMenu extends React.Component {
  state = {
    is_loading: false,
    token: '',
  };

  componentDidMount() {
    this.getToken();
  }

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

  getToken = async () => {
    try {
      const { navigate } = this.props;
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

  syncData = () => {
    const { token } = this.state;
    this.setState({ is_loading: true });
    this.menu.hide();

    httpGet(SYNC_DATA, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        this.saveDb(res);
        this.setState({ is_loading: false });
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err), 200);
      });
  };

  saveDb = async db => {
    try {
      var path = RNFS.DocumentDirectoryPath + '/library_db.json';

      // write the file
      await RNFS.writeFile(path, JSON.stringify(db), 'utf8')
        .then(success => {
          showToast('Synced Successffuly');
        })
        .catch(err => {
          console.log(err.message);
        });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { is_loading } = this.state;
    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />

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

          <MenuItem onPress={this.syncData} textStyle={GlobalStyles.menuText}>
            <VectorIcon name="sync" size={12} color="#808080" />
            <Text>Sync DB</Text>
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
