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
import { showToast } from '../utils/helper';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFS from 'react-native-fs';
import { NavigationEvents } from 'react-navigation';

export default class Home extends Component {
  static navigationOptions = { header: null };

  state = {
    is_loading: false,
    selected_language: '',
    rack_options: [],
    selected_rack: '',
    side_options: [],
    selected_side: '',
    show_rack: false,
    show_side: false,
    db: {
      languages: [],
      books: [],
      sides: [],
      racks: [],
    },
  };

  componentDidMount() {
    setTimeout(() => this.getDb(), 200);
  }

  getDb = async () => {
    const {
      db: { languages },
    } = this.state;

    if (languages.length != 0) {
      return;
    }
    this.setState({ is_loading: true });
    const { navigate } = this.props.navigation;
    try {
      let db = null;
      var path = RNFS.DocumentDirectoryPath + '/library_db.json';

      await RNFS.readFile(path)
        .then(result => {
          db = result;
        })
        .catch(err => {
          console.log(err.message, err.code);
        });

      this.setState({ is_loading: false });

      if (db != null) {
        this.setState({ db: JSON.parse(db) });
      } else {
        navigate('Login');
      }
    } catch (e) {
      // showToast(e);
    }
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
      show_rack,
      show_side,
      db: { languages, racks, sides, books },
    } = this.state;

    return (
      <>
        <NavigationEvents onDidFocus={payload => this.getDb()} />

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

              <View>
                <Picker
                  selectedValue={selected_language}
                  style={GlobalStyles.select}
                  onValueChange={(v, i) => {
                    let filtred_racks = racks;
                    if (v) {
                      filtred_racks = racks.filter(r => r.language_id == v);
                      this.setState({ show_rack: true });
                    } else {
                      this.setState({ show_rack: false, show_side: false });
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
                  {languages &&
                    languages.map(obj => (
                      <Picker.Item
                        key={obj.id}
                        label={obj.name}
                        value={obj.id}
                      />
                    ))}
                </Picker>
              </View>

              <View>
                <Picker
                  enabled={show_rack}
                  selectedValue={selected_rack}
                  style={GlobalStyles.select}
                  onValueChange={(v, i) => {
                    let filtred_sides = sides;
                    if (v) {
                      filtred_sides = sides.filter(r => r.rack_id == v);
                      this.setState({ show_side: true });
                    } else {
                      this.setState({ show_side: false });
                    }
                    this.setState({
                      selected_rack: v,
                      selected_side: '',
                      side_options: filtred_sides,
                    });
                  }}
                >
                  <Picker.Item label="Select Rack" value="" />
                  {rack_options.length > 0 &&
                    rack_options.map(obj => (
                      <Picker.Item
                        key={obj.id}
                        label={obj.name}
                        value={obj.id}
                      />
                    ))}
                </Picker>
              </View>

              <View>
                <Picker
                  enabled={show_side}
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
