import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import GlobalStyles from '../assets/styles/StyleSheet';
import { httpGet } from '../utils/http';
import { SCAN_SHELF_URL } from '../configs/constants';
import { Icon } from 'react-native-elements';
import ListItem from '../components/ListItem';
import Spinner from 'react-native-loading-spinner-overlay';
import { showToast } from '../utils/helper';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderMenu from '../components/HeaderMenu';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

class ScanShelf extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }
  state = {
    is_loading: false,
    token: '',
    book_no: '',
    missing: [],
    actual: [],
    extra: [],
    index: 0,
    db: {
      languages: [],
      books: [],
      sides: [],
      racks: [],
    },
    routes: [
      { key: 'actual', title: 'Actual (0/0)' },
      { key: 'extra', title: 'Extra (0)' },
      { key: 'missing', title: 'Missing (0)' },
    ],
  };

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'History',
      headerRight: (
        <View style={GlobalStyles.headerRightContainer}>
          <HeaderMenu navigate={navigate} />
        </View>
      ),
    };
  };

  componentDidMount() {
    this.getToken();
    this.getDb();
  }

  getDb = async () => {
    const { navigate } = this.props.navigation;

    this.setState({ is_loading: true });

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

      if (db != null) {
        this.setState({ db: JSON.parse(db), is_loading: false });
        const { books } = JSON.parse(db);

        const { navigation } = this.props;
        const lang = navigation.getParam('lang');
        const rack = navigation.getParam('rack');
        const side = navigation.getParam('side');
        const shelf_data = books.filter(
          book =>
            book.language_id == lang &&
            book.rack_id == rack &&
            book.side_id == side
        );

        this.setState({ missing: shelf_data, index: 2 });

        setTimeout(() => {
          this.updateTabs();
          this.setState({ is_loading: false });
        }, 100);
        this.input.focus();
      } else {
        navigate('Login');
      }
    } catch (e) {
      // showToast(e);
    }
  };

  /**
   * Play Beep
   */
  playSound = name => {
    const sound = new Sound(`${name}.mp3`, null, error => {
      sound.play(() => sound.release());
    });
  };

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
   * Book Exist in array or not
   */
  isExistInArray = (stack, needle) => {
    return stack.find(book => {
      return book.barcode == needle.barcode;
    });
  };

  /**
   * Scan Book & Adjust the Tabs
   */
  scanBook = book_no => {
    if (!book_no) Alert.alert('Please enter Book Number to scan');

    const {
      missing,
      actual,
      extra,
      db: { books },
    } = this.state;

    const scanned = [...missing, ...actual].find(book => {
      return book.barcode == book_no;
    });

    if (scanned) {
      const missing_copy = [...missing];
      if (this.isExistInArray(missing_copy, scanned)) {
        missing_copy.splice(missing.indexOf(scanned), 1);
      }

      const actual_copy = [...actual];
      if (!this.isExistInArray(actual_copy, scanned)) actual_copy.push(scanned);

      this.setState({ missing: missing_copy, actual: actual_copy, index: 0 });

      setTimeout(() => {
        this.updateTabs();
        this.input.clear();
        this.input.focus();
        this.playSound('found');
      }, 100);
    } else {
      const extra_book = books.find(book => {
        return book.barcode == book_no;
      });

      if (extra_book) {
        const extra_copy = [...extra];
        extra_copy.push(extra_book);
        this.setState({ extra: extra_copy, index: 1 });
        setTimeout(() => {
          this.updateTabs();
          this.playSound('not_found');
          this.input.clear();
          this.input.focus();
        }, 100);
      } else {
        this.input.clear();
        this.input.focus();
        this.playSound('not_found');
        showToast('Record not found');
      }

      // let url = FETCH_BOOK_URL;
      // url = url.replace(/#ID#/g, book_no);
      // this.setState({ is_loading: true });
      // httpGet(url, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })
      //   .then(res => {
      //     const { data } = res;
      //     const extra_copy = [...extra];
      //     if (!this.isExistInArray(extra_copy, data)) extra_copy.push(data);
      //     this.setState({ extra: extra_copy, index: 1 });
      //     setTimeout(() => {
      //       this.updateTabs();
      //       this.setState({ is_loading: false });
      //       this.playSound('not_found');
      //       this.input.clear();
      //       this.input.focus();
      //     }, 100);
      //   })
      //   .catch(err => {
      //     this.setState({ is_loading: false });
      //     setTimeout(() => showToast(err), 200);
      //     this.input.focus();
      //     this.playSound('not_found');
      //   });
    }
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

        this.setState({ missing: data });

        setTimeout(() => {
          this.updateTabs();
          this.setState({ is_loading: false, index: 2 });
        }, 200);
      })
      .catch(err => {
        this.setState({ is_loading: false });
        setTimeout(() => showToast(err), 100);
      });
  };

  /**
   * Updates Tabs
   */
  updateTabs = () => {
    const { actual, extra, missing, routes } = this.state;
    const routes_copy = [...routes];

    const new_routes = routes_copy.map(tab => {
      if (tab.key == 'actual') {
        tab.title = `Actual (${actual.length}/${missing.length})`;
      }

      if (tab.key == 'extra') {
        tab.title = `Extra (${extra.length})`;
      }

      if (tab.key == 'missing') {
        tab.title = `Missing (${missing.length})`;
      }
      return tab;
    });

    this.setState({ routes: new_routes });
  };

  render() {
    const { book_no, missing, actual, extra, is_loading } = this.state;
    const ActualView = () => <ListItem data={actual} />;
    const ExtraView = () => <ListItem data={extra} />;
    const MissingView = () => <ListItem data={missing} />;

    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />

        <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
          <TextInput
            ref={input => {
              this.input = input;
            }}
            selectTextOnFocus={true}
            blurOnSubmit={false}
            value={book_no}
            autoCapitalize="none"
            onChangeText={value => {
              this.setState({ book_no: value });
            }}
            placeholder="Enter Book Number"
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            style={[styles.textInput]}
            onSubmitEditing={event => this.scanBook(event.nativeEvent.text)}
          />
          <TouchableOpacity onPress={() => this.scanBook(book_no)}>
            <Icon name="send" color="#8c1d1a" />
          </TouchableOpacity>
        </View>

        <TabView
          navigationState={this.state}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabBarIndicator}
              style={styles.tabBarHeading}
              renderLabel={({ route, focused, color }) => (
                <Text
                  style={
                    route.key ===
                    props.navigationState.routes[this.state.index].key
                      ? styles.tabBarHeadingTextActive
                      : styles.tabBarHeadingText
                  }
                >
                  {route.title}
                </Text>
              )}
            />
          )}
          renderScene={SceneMap({
            actual: ActualView,
            extra: ExtraView,
            missing: MissingView,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  tabView: {
    flex: 1,
    marginTop: 2000,
    backgroundColor: '#ff0000',
  },
  inputContainer: {
    justifyContent: 'space-between',
  },
  tabBarHeading: {
    backgroundColor: '#fff',
  },
  tabBarHeadingText: {
    color: 'black',
  },
  tabBarHeadingTextActive: {
    color: '#006400',
  },
  tabBarIndicator: {
    backgroundColor: '#006400',
  },
});

export default ScanShelf;
