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

export default class Home extends Component {
  static navigationOptions = { header: null };

  state = {
    selected_language: '',
    rack_options: [],
    selected_rack: '',
    side_options: [],
    selected_side: '',
    db: {
      languages: [],
      books: [],
      sides: [],
      racks: [],
    },
  };

  componentDidMount() {
    this.setState({
      selected_language: '',
      selected_rack: '',
      selected_side: '',
    });
    this.getDb();
  }

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

  render() {
    const { navigate } = this.props.navigation;
    const {
      selected_language,
      selected_rack,
      selected_side,
      rack_options,
      side_options,
      db: { languages, racks, sides, books },
    } = this.state;

    return (
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
                  <Picker.Item key={obj.id} label={obj.name} value={obj.id} />
                ))}
              </Picker>
            </View>

            {Boolean(selected_language) && (
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
            )}

            {Boolean(selected_rack) && (
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
            )}

            {Boolean(selected_side) && (
              <TouchableOpacity
                onPress={() =>
                  navigate('ScanShelf', {
                    lang: selected_language,
                    rack: selected_rack,
                    side: selected_side,
                  })
                }
                style={GlobalStyles.button}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>SCAN SHELF</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
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
