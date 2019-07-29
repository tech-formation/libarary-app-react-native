import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Button,
  FlatList,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import GlobalStyles from '../assets/styles/StyleSheet';
import { httpGet } from '../utils/http';
import { SCAN_SHELF_URL, TEMP_TOKEN } from '../configs/constants';

class ScanShelf extends Component {
  state = {
    shelf_no: '',
    shelf_data: [],
    index: 0,
    routes: [
      { key: 'first', title: 'Actual (0/0)' },
      { key: 'second', title: 'Extra (0)' },
      { key: 'third', title: 'Missing (0)' },
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
    const shelf_no = navigation.getParam('shelf_no', '2');
    this.scanShelf(shelf_no);
  }

  /**
   * Scan Shelf
   */
  scanShelf = shelf_no => {
    let url = SCAN_SHELF_URL;
    url = url.replace(/#ID#/g, shelf_no);

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

        this.setState({ shelf_data: data });
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
    const { shelf_data, routes } = this.state;
    const routes_copy = [...routes];

    const new_routes = routes_copy.map(tab => {
      if (tab.key == 'first') {
        tab.title = `Actual (0/${shelf_data.length})`;
      }
      return tab;
    });

    this.setState({ routes: new_routes });
  };

  render() {
    const { shelf_no, shelf_data } = this.state;

    const FirstRoute = () => (
      <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
        <FlatList
          data={shelf_data}
          renderItem={({ item }) => (
            <View
              key={item.book_id}
              style={[
                {
                  backgroundColor: '#673ab7',
                  paddingVertical: 10,
                  paddingLeft: 20,
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#a9a9a9',
                },
              ]}
            >
              <Text style={[{ color: '#fff' }]}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    );

    const SecondRoute = () => (
      <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
    );

    const ThirdRoute = () => (
      <View style={[styles.scene, { backgroundColor: '#ff0000' }]} />
    );

    return (
      <>
        <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
          <TextInput
            value={shelf_no}
            autoCapitalize="none"
            onChangeText={value => {
              this.setState({ shelf_no: value });
            }}
            placeholder="Enter Book Number"
            underlineColorAndroid="transparent"
            style={[styles.textInput]}
          />
          <Button
            onPress={() => {}}
            title="Scan"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <TabView
          navigationState={this.state}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'black' }}
              style={{ backgroundColor: 'white' }}
              renderLabel={({ route, focused, color }) => (
                <Text style={{ color: 'black', fontWeight: '600' }}>
                  {route.title}
                </Text>
              )}
            />
          )}
          renderScene={SceneMap({
            first: FirstRoute,
            second: SecondRoute,
            third: ThirdRoute,
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
  textInput: {},
  scene: {
    flex: 1,
  },
});

export default ScanShelf;
