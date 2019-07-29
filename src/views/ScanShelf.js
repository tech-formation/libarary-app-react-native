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
import {
  SCAN_SHELF_URL,
  TEMP_TOKEN,
  FETCH_BOOK_URL,
} from '../configs/constants';
import { Icon } from 'react-native-elements';
import ListItem from '../components/ListItem';

class ScanShelf extends Component {
  state = {
    book_no: '',
    missing: [],
    actual: [],
    extra: [],
    index: 0,
    routes: [
      { key: 'actual', title: 'Actual (0/0)' },
      { key: 'extra', title: 'Extra (0)' },
      { key: 'missing', title: 'Missing (0)' },
    ],
  };

  static navigationOptions = {
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
      </View>
    ),
  };

  componentDidMount() {
    const { navigation } = this.props;
    const book_no = navigation.getParam('book_no', '2');
    this.scanShelf(book_no);
  }

  /**
   * Scan Book & Adjust the Tabs
   */
  scanBook = book_id => {
    if (!book_id) Alert.alert('Please enter Book Number to scan');

    const { missing, actual, extra } = this.state;

    const scanned = missing.find(book => {
      return book.book_id == book_id;
    });

    if (scanned) {
      const missing_copy = [...missing];
      missing_copy.splice(missing.indexOf(scanned), 1);

      const actual_copy = [...actual];
      actual_copy.push(scanned);

      this.setState({ missing: missing_copy, actual: actual_copy });

      setTimeout(() => {
        this.updateTabs();
      }, 100);
    } else {
      let url = FETCH_BOOK_URL;
      url = url.replace(/#ID#/g, book_id);

      httpGet(url, {
        headers: {
          Authorization: `Bearer ${TEMP_TOKEN}`,
        },
      })
        .then(res => {
          const { data } = res;
          const extra_copy = [...extra];
          extra_copy.push(data);

          this.setState({ extra: extra_copy });

          setTimeout(() => {
            this.updateTabs();
          }, 100);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  /**
   * Scan Shelf
   */
  scanShelf = book_no => {
    let url = SCAN_SHELF_URL;
    url = url.replace(/#ID#/g, book_no);

    httpGet(url, {
      headers: {
        Authorization: `Bearer ${TEMP_TOKEN}`,
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
        }, 200);
      })
      .catch(err => {
        console.log(err);
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
    const { book_no, missing, actual, extra } = this.state;
    const ActualView = () => <ListItem data={actual} />;
    const ExtraView = () => <ListItem data={extra} />;
    const MissingView = () => <ListItem data={missing} />;

    return (
      <>
        <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
          <TextInput
            value={book_no}
            autoCapitalize="none"
            onChangeText={value => {
              this.setState({ book_no: value });
            }}
            placeholder="Enter Book Number"
            underlineColorAndroid="transparent"
            style={[styles.textInput]}
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
