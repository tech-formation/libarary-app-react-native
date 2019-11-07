import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import GlobalStyles from '../assets/styles/StyleSheet';
import { Icon } from 'react-native-elements';
import ListItem from '../components/ListItem';
import Spinner from 'react-native-loading-spinner-overlay';
import { showToast } from '../utils/helper';
import HeaderMenu from '../components/HeaderMenu';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { NavigationEvents } from 'react-navigation';
import Modal from 'react-native-modal';

const CONTINUE_GAP = 3;
const LOAD_CHUNK = 10;

class ScanShelf extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.input = React.createRef();
  }

  /**
   * State
   */
  state = {
    is_loading: false,
    is_modal_visible: false,
    book_no: '31111000154367',
    missing: [],
    actual: [],
    index: 0,
    books: [],
    scan_index: 0,
    routes: [
      { key: 'actual', title: 'Actual (0/0)' },
      { key: 'missing', title: 'Missing (0)' },
    ],
  };

  /**
   * Static Header Options
   */
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

  /**
   * Reset state
   */
  resetState = () => {
    this.setState({
      missing: [],
      actual: [],
      index: 0,
      scan_index: 0,
      routes: [
        { key: 'actual', title: 'Actual (0/0)' },
        { key: 'missing', title: 'Missing (0)' },
      ],
    });
  };

  /**
   * Reads database from local JSON file.
   */
  readJsonDbFile = async () => {
    this.resetState();

    const { navigate } = this.props.navigation;
    this.setState({ is_loading: true });

    try {
      var path = RNFS.DocumentDirectoryPath + '/library_db.json';

      await RNFS.readFile(path)
        .then(db => {
          this.setState({ books: JSON.parse(db), is_loading: false });
          this.input.focus();
        })
        .catch(err => {
          navigate('Login');
          this.handleError(err);
          this.setState({ is_loading: false });
        });
    } catch (err) {
      this.setState({ is_loading: false });
      this.handleError(err);
    }
  };

  /**
   * For handling exceptions
   */
  handleError = err => {
    console.log(err.message, err.code);
  };

  /**
   * Play Beep
   */
  playSound = name => {
    const sound = new Sound(`${name}.mp3`, null, error => {
      sound.play(() => sound.release());
    });
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
   * Record not found actions
   */
  recordNotFound = () => {
    this.inputClearAndFocus();
    this.playSound('not_found');
    showToast('Record not found');
  };

  /**
   * Record found actions
   */
  recordFound = () => {
    this.updateTabs();
    this.inputClearAndFocus();
    this.playSound('found');
  };

  /**
   * Clears the input and back focus
   */
  inputClearAndFocus = () => {
    this.input.clear();
    this.input.focus();
    this.setState({ book_no: '' });
  };

  /**
   * Updates Tabs text and counter as per data
   */
  updateTabs = () => {
    const { actual, missing, routes } = this.state;
    const routes_copy = [...routes];

    const new_routes = routes_copy.map(tab => {
      if (tab.key == 'actual') {
        tab.title = `Actual (${actual.length}/${missing.length})`;
      }

      if (tab.key == 'missing') {
        tab.title = `Missing (${missing.length})`;
      }
      return tab;
    });

    this.setState({ routes: new_routes });
  };

  /**
   * Initial Scanning
   */
  initialBookScan = () => {
    const { book_no, actual, books } = this.state;

    const scanned_book = books.find(book => {
      return book.barcode == book_no;
    });

    if (scanned_book) {
      const scanned_index = books.indexOf(scanned_book);
      const book_load = books.slice(scanned_index, LOAD_CHUNK);
      book_load.splice(scanned_index, 1);

      const actual_copy = [...actual];
      if (!this.isExistInArray(actual_copy, scanned_book)) {
        actual_copy.push(scanned_book);
      }

      this.setState({
        missing: book_load,
        actual: actual_copy,
        index: 0,
        scan_index: scanned_index,
      });

      setTimeout(this.recordFound, 100);
    } else {
      this.recordNotFound();
    }
  };

  /**
   * Scanning continues
   */
  scanBook = () => {
    const { missing, actual, book_no, books, scan_index } = this.state;

    if (!book_no) {
      showToast('Please enter Book Number to scan');
      return;
    }

    if (missing.length == 0) {
      this.initialBookScan();
    } else {
      const already_scanned = actual.find(book => {
        return book.barcode == book_no;
      });

      if (already_scanned) {
        showToast('Book already scanned.');
        return;
      }

      const scanned = missing.find(book => {
        return book.barcode == book_no;
      });

      if (scanned) {
        const missing_copy = [...missing];
        const scanned_index = books.indexOf(scanned);
        const index_diff = scanned_index - scan_index;

        if (index_diff > 1 && index_diff <= CONTINUE_GAP) {
          showToast('You can continue');
        }

        if (index_diff > CONTINUE_GAP) {
          showToast('You have to OUT this book');
        }

        if (this.isExistInArray(missing_copy, scanned)) {
          missing_copy.splice(missing.indexOf(scanned), 1);
        }

        const actual_copy = [...actual];
        actual_copy.push(scanned);

        this.setState({
          missing: missing_copy,
          actual: actual_copy,
          scan_index: scanned_index,
          index: 0,
        });

        setTimeout(this.recordFound, 100);
      } else {
        this.recordNotFound();
      }
    }
  };

  render() {
    const {
      book_no,
      missing,
      actual,
      is_loading,
      is_modal_visible,
    } = this.state;
    const ActualView = () => <ListItem data={actual} />;
    const MissingView = () => <ListItem data={missing} />;

    return (
      <>
        <NavigationEvents onDidFocus={payload => this.readJsonDbFile()} />

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
            onSubmitEditing={this.scanBook}
          />
          <TouchableOpacity onPress={this.scanBook}>
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
            missing: MissingView,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />

        <Modal style={GlobalStyles.flexCenter} isVisible={is_modal_visible}>
          <View style={GlobalStyles.confirmaitonModal}>
            <TouchableOpacity
              onPress={() => {}}
              style={GlobalStyles.simpleButton}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>OUT</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({ is_modal_visible: false });
              }}
              style={GlobalStyles.simpleButton}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>CONTINUE</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
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
