import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Picker,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import AsyncStorage from '@react-native-community/async-storage';
import { showToast } from '../utils/helper';
import { httpGet } from '../utils/http';
import { SYNC_DATA } from '../configs/constants';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Home extends Component {
  static navigationOptions = { header: null };

  state = {
    is_loading: false,
    selected_language: '',
    rack_options: [],
    selected_rack: '',
    side_options: [],
    selected_side: '',
    token: '',
    db: {
      languages: [],
      books: [],
      sides: [],
      racks: [],
    },
  };

  componentDidMount() {
    this.getDb();
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

  getDb = async () => {
    const { navigate } = this.props.navigation;
    try {
      const db = await AsyncStorage.getItem('lib_db');

      if (db != null) {
        this.setState({ db: JSON.parse(db) });
      } else {
        navigate('Login');
      }
    } catch (e) {
      // showToast(e);
    }
  };

  saveDb = async db => {
    try {
      await AsyncStorage.setItem('lib_db', JSON.stringify(db));
      this.setState({
        db,
        selected_language: '',
        selected_side: '',
        selected_rack: '',
      });
    } catch (e) {
      console.log(e);
      // showToast(e);
    }
  };

  syncData = () => {
    const { token } = this.state;
    this.setState({ is_loading: true });

    httpGet(SYNC_DATA, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        this.saveDb(res);
        showToast('Synced Successfully');
        this.setState({ is_loading: false });
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err), 200);
      });
  };

  render() {
    const { navigate } = this.props.navigation;
    const {
      is_loading,
      selected_language,
      selected_rack,
      selected_side,
      rack_options,
      side_options,
      db: { languages, racks, sides, books },
    } = this.state;

    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />
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

              {/* <TouchableOpacity
                onPress={this.syncData}
                style={GlobalStyles.sync}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>SYNC</Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => {
                  if (!books.length) {
                    showToast('No Records Found.');
                    return;
                  }
                  navigate('BookDetail', { book: books[0] });
                }}
                style={GlobalStyles.button}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>SCAN A BOOK</Text>
                </View>
              </TouchableOpacity>

              <View style={GlobalStyles.verticalSpace} />
              {languages.length > 0 && (
                <View>
                  <Picker
                    selectedValue={selected_language}
                    style={GlobalStyles.select}
                    onValueChange={(v, i) => {
                      let filtred_racks = [];
                      if (v) {
                        filtred_racks = racks.filter(r => r.language_id == v);
                      }
                      this.setState({
                        selected_language: v,
                        selected_rack: '',
                        selected_side: '',
                        rack_options: filtred_racks,
                      });
                    }}
                  >
                    <Picker.Item label="Select Language" value="" />
                    {languages.map(obj => (
                      <Picker.Item
                        key={obj.id}
                        label={obj.name}
                        value={obj.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}

              <View>
                <Picker
                  selectedValue={selected_rack}
                  style={GlobalStyles.select}
                  onValueChange={(v, i) => {
                    let filtred_sides = [];
                    if (v) {
                      filtred_sides = sides.filter(r => r.rack_id == v);
                    }
                    this.setState({
                      selected_rack: v,
                      selected_side: '',
                      side_options: filtred_sides,
                    });
                  }}
                >
                  <Picker.Item label="Select Rack" value="" />
                  {rack_options.map(obj => (
                    <Picker.Item key={obj.id} label={obj.name} value={obj.id} />
                  ))}
                </Picker>
              </View>

              <View>
                <Picker
                  selectedValue={selected_side}
                  style={GlobalStyles.select}
                  onValueChange={(v, i) => this.setState({ selected_side: v })}
                >
                  <Picker.Item label="Select Side" value="" />
                  {side_options.map(obj => (
                    <Picker.Item key={obj.id} label={obj.name} value={obj.id} />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!selected_language) {
                    showToast('Please select Language');
                    return;
                  }

                  if (!selected_rack) {
                    showToast('Please select Rack');
                    return;
                  }

                  if (!selected_side) {
                    showToast('Please select Side');
                    return;
                  }

                  navigate('ScanShelf', {
                    lang: selected_language,
                    rack: selected_rack,
                    side: selected_side,
                  });
                }}
                style={GlobalStyles.button}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>SCAN RACK SIDE</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
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
