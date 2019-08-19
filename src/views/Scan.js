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
import { showToast, capitalize } from '../utils/helper';
import HeaderMenu from '../components/HeaderMenu';
import { FETCH_BOOK_URL, SCAN_SHELF_URL } from '../configs/constants';
import { httpGet } from '../utils/http';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Scan extends Component {
  static navigationOptions = ({ navigation }) => {
    const {
      state: {
        params: { type },
      },
      navigate,
    } = navigation;

    return {
      title: `Scan ${capitalize(type)}`,
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
    is_loading: false,
    book_no: '',
    token: '',
    book: {
      shelf_id: '',
      isbn_number: '',
      title: '',
      author: '',
    },
  };

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    const { navigate } = this.props.navigation;
    try {
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

  /**
   * Handles scan shelf
   */
  scanEntity = () => {
    const { number } = this.state;
    const { navigation } = this.props;
    const type = navigation.getParam('type');

    if (!number) {
      showToast(`Please enter ${type} no to scan.`);
      return;
    }

    if (type == 'book') {
      this.scanBook(number);
    } else {
      this.scanShelf(number);
    }
  };

  /**
   * Handles scan shelf
   */
  scanBook = book_no => {
    const { token } = this.state;
    const {
      navigation: { navigate },
    } = this.props;

    let url = FETCH_BOOK_URL;
    url = url.replace(/#ID#/g, book_no);
    this.setState({ is_loading: true });

    httpGet(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const { data } = res;
        this.setState({ is_loading: false });
        navigate('BookDetail', { book: { ...data } });
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err.error.message), 100);
      });
  };

  /**
   * Scan Shelf
   */
  scanShelf = shelf_no => {
    let url = SCAN_SHELF_URL;
    url = url.replace(/#ID#/g, shelf_no);
    this.setState({ is_loading: true });

    httpGet(url, {
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
    })
      .then(res => {
        const {
          data: {
            books: { data },
          },
        } = res;
        const {
          navigation: { navigate },
        } = this.props;

        this.setState({ is_loading: false });
        navigate('ScanShelf', { shelf_data: data });
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err.error.message), 100);
      });
  };

  render() {
    const { navigation } = this.props;
    const { number, is_loading } = this.state;
    const type = navigation.getParam('type');

    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />
        <View style={styles.mainContainer}>
          <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
            <TextInput
              placeholder={`Enter ${type == 'book' ? 'Book' : 'Shelf'}  Number`}
              underlineColorAndroid="transparent"
              style={[styles.textInput]}
              autoCapitalize="none"
              keyboardType="numeric"
              value={number}
              onChangeText={value => {
                this.setState({ number: value });
              }}
              onSubmitEditing={this.scanEntity}
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
  textInput: {
    flex: 1,
  },
  inputContainer: {
    justifyContent: 'space-between',
  },
});
