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

const CONTINUE_GAP = 20;
const LOAD_CHUNK = 2000;

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
    can_continue: true,
    book_no: '',
    current_scanned_index: 0,
    expected: [],
    missing: [],
    actual: [],
    index: 0,
    books: [],
    scan_index: 0,
    routes: [
      { key: 'actual', title: 'Actual (0/0)' },
      { key: 'missing', title: 'Missing (0)' },
      { key: 'expected', title: 'Expected (0)' },
    ],
  };

  /**
   * Static Header Options
   */
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: 'Scan Rack',
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
      expected: [],
      actual: [],
      missing: [],
      index: 0,
      scan_index: 0,
      current_scanned_index: 0,
      routes: [
        { key: 'actual', title: 'Actual (0/0)' },
        { key: 'missing', title: 'Missing (0)' },
        { key: 'expected', title: 'Expected (0)' },
      ],
    });
  };

  /**
   * Reads database from local JSON file.
   */
  readJsonDbFile = async () => {
    this.setState({ books: global.db });
    this.resetState();
    this.inputClearAndFocus();
  };

  getDb = async () => {
    this.setState({ is_loading: true });
    const { navigate } = this.props.navigation;

    if (!global.db) {
      var path = RNFS.DocumentDirectoryPath + '/library_db.json';
      global.db = [];
      await RNFS.readFile(path)
        .then(data => {
          global.db = JSON.parse(data);
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    }

    this.readJsonDbFile();
    this.setState({ is_loading: false });

    if (!global.db) {
      navigate('Login');
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
    const { actual, expected, routes, missing } = this.state;
    const routes_copy = [...routes];

    const new_routes = routes_copy.map(tab => {
      if (tab.key == 'actual') {
        tab.title = `Actual (${actual.length}/${expected.length})`;
      }

      if (tab.key == 'missing') {
        tab.title = `Missing (${missing.length})`;
      }

      if (tab.key == 'expected') {
        tab.title = `Expected (${expected.length})`;
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
        actual_copy.unshift(scanned_book);
      }

      this.setState({
        expected: book_load,
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
    const { expected, actual, book_no, books, scan_index } = this.state;

    if (!book_no) {
      showToast('Please enter Book Number to scan');
      return;
    }

    if (expected.length == 0) {
      this.initialBookScan();
    } else {
      const already_scanned = actual.find(book => {
        return book.barcode == book_no;
      });

      if (already_scanned) {
        showToast('Book already scanned.');
        this.inputClearAndFocus();
        return;
      }

      const scanned = expected.find(book => {
        return book.barcode == book_no;
      });

      if (scanned) {
        const expected_copy = [...expected];
        const scanned_index = books.indexOf(scanned);
        const index_diff = scanned_index - scan_index;

        this.setState({
          current_scanned_index: scanned_index,
        });

        if (index_diff <= 0) {
          this.setState({
            is_modal_visible: true,
            can_continue: false,
          });
        } else if (index_diff > 1 && index_diff <= CONTINUE_GAP) {
          this.setState({
            is_modal_visible: true,
            can_continue: true,
          });
        } else if (index_diff > CONTINUE_GAP) {
          this.setState({
            is_modal_visible: true,
            can_continue: false,
          });
        } else {
          if (this.isExistInArray(expected_copy, scanned)) {
            expected_copy.splice(expected.indexOf(scanned), 1);
          }

          const actual_copy = [...actual];
          actual_copy.unshift(scanned);

          this.setState({
            expected: expected_copy,
            actual: actual_copy,
            scan_index: scanned_index,
            index: 0,
          });

          setTimeout(this.recordFound, 100);
        }
      } else {
        this.recordNotFound();
      }
    }
  };

  /**
   * When user click on Out from Modal
   */
  onOut = () => {
    this.setState({ is_modal_visible: false });
    this.inputClearAndFocus();
    showToast('Out Successfully');
  };

  /**
   * When user click on continue from Modal
   */
  onContinue = () => {
    const {
      current_scanned_index,
      books,
      expected,
      actual,
      scan_index,
      missing,
    } = this.state;

    this.setState({
      is_modal_visible: false,
    });

    const expected_copy = [...expected];
    let missing_copy = [...missing];
    const scanned = books[current_scanned_index];
    const diff = current_scanned_index - scan_index;

    if (this.isExistInArray(expected_copy, scanned)) {
      expected_copy.splice(expected.indexOf(scanned), 1);
    }

    const missed = expected_copy.splice(0, diff - 1);

    missing_copy = [...missing_copy, ...missed];

    const actual_copy = [...actual];
    actual_copy.unshift(scanned);

    this.setState({
      scan_index: current_scanned_index,
      expected: expected_copy,
      actual: actual_copy,
      missing: missing_copy,
      index: 0,
    });

    setTimeout(this.recordFound, 100);
  };

  render() {
    const {
      book_no,
      expected,
      missing,
      actual,
      is_loading,
      is_modal_visible,
      current_scanned_index,
      scan_index,
      can_continue,
    } = this.state;

    const ActualView = () => (
      <ListItem data={actual} navigation={this.props.navigation} />
    );
    const ExpectedView = () => (
      <ListItem data={expected} navigation={this.props.navigation} />
    );
    const MissingView = () => (
      <ListItem data={missing} navigation={this.props.navigation} />
    );
    const diff = current_scanned_index - (scan_index + 2);
    let book_title = '';
    let book_call_number = '';

    if (expected.length) {
      const { title, call_number } = expected[0];
      book_title = title;
      book_call_number = call_number;
    }

    return (
      <>
        <NavigationEvents onWillFocus={this.getDb} />

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
            expected: ExpectedView,
            missing: MissingView,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
        />

        <Modal style={GlobalStyles.flexCenter} isVisible={is_modal_visible}>
          <View style={GlobalStyles.confirmaitonModal}>
            {can_continue && (
              <Text style={GlobalStyles.modalTitle}>
                {`Expected: ${book_title} (${book_call_number}) ${
                  diff ? `and ${diff} more` : ''
                }.`}
              </Text>
            )}

            <TouchableOpacity
              onPress={this.onOut}
              style={GlobalStyles.simpleButton}
            >
              <View>
                <Text style={GlobalStyles.buttonText}>OUT</Text>
              </View>
            </TouchableOpacity>

            {can_continue && (
              <TouchableOpacity
                onPress={this.onContinue}
                style={GlobalStyles.simpleButton}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>CONTINUE</Text>
                </View>
              </TouchableOpacity>
            )}
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
