import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import { Icon } from 'react-native-elements';

export default class BookDetail extends Component {
  state = {
    book_no: '',
  };

  static navigationOptions = {
    headerRight: (
      <View style={GlobalStyles.headerRightContainer}>
        <TouchableOpacity
          onPress={this._onPressButton}
          style={GlobalStyles.headerRightButton}
        >
          <View>
            <Text style={GlobalStyles.buttonText}>Scan a Shelf</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._onPressButton}>
          <Icon name="more-vert" color="#fff" />
        </TouchableOpacity>
      </View>
    ),
  };

  /**
   * Handles scan shelf
   */
  scanBook = () => {
    const { book_no } = this.state;
    const {
      navigation: { navigate },
    } = this.props;

    if (!book_no) {
      Alert.alert('Please enter shelf no to scan.');
      return;
    }

    navigate('ScanShelf', {
      book_no,
    });
  };

  render() {
    const { book_no } = this.state;

    return (
      <>
        <View style={styles.mainContainer}>
          <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
            <TextInput
              placeholder="Enter Book Number"
              underlineColorAndroid="transparent"
              style={[styles.textInput]}
              autoCapitalize="none"
              value={book_no}
              onChangeText={value => {
                this.setState({ book_no: value });
              }}
            />
            <TouchableOpacity onPress={() => this.scanShelf()}>
              <Icon name="send" color="#8c1d1a" />
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsTopRow}>
              <View style={styles.detailImageContainer}>
                <Image
                  source={require('../assets/images/books.png')}
                  style={styles.booksImage}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.bookTitle}>The Legacy of Love</Text>
                <Text style={styles.bookSubTitle}>By: Sudha Murthy</Text>
                <Text style={styles.bookSubTitle}>ISBN: 2434244324423</Text>
              </View>
            </View>
            <View style={styles.detailMidRow}>
              <Text style={styles.bookSubTitle}>Shelf No: 100</Text>
              <Text style={[styles.bookSubTitle, styles.paddingLeft10]}>
                Row No: 2
              </Text>
              <Text style={[styles.bookSubTitle, styles.paddingLeft10]}>
                Column: 4
              </Text>
            </View>
            <View style={styles.detailBottomRow}>
              <Text style={styles.bookDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </Text>
              <TouchableOpacity
                onPress={this._onPressButton}
                style={styles.scanBookButton}
              >
                <View>
                  <Text style={styles.scanBookText}>SCAN OTHER BOOK</Text>
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
  inputContainer: {
    justifyContent: 'space-between',
  },
  detailsContainer: {
    height: '100%',
    backgroundColor: '#fafafa',
    margin: 20,
  },
  detailsTopRow: {
    flex: 0.13,
    flexDirection: 'row',
    paddingTop: 10,
  },
  detailImageContainer: {
    flex: 0.3,
  },
  booksImage: {
    width: 77,
    height: 100,
    position: 'absolute',
    left: -10,
  },
  titleContainer: {
    flex: 0.7,
  },
  bookTitle: {
    fontSize: 16,
    paddingTop: 20,
  },
  bookSubTitle: {
    fontSize: 14,
    color: '#a9a9a9',
    paddingTop: 5,
  },
  detailMidRow: {
    flex: 0.03,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailBottomRow: {
    flex: 0.5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textInput: {},
  paddingLeft10: {
    paddingLeft: 10,
  },
  bookDescription: {
    fontSize: 14,
    color: '#808080',
    padding: 20,
  },
  scanBookText: {
    color: '#8c1d1a',
    borderWidth: 1,
    padding: 5,
    borderColor: '#8c1d1a',
    borderRadius: 5,
    paddingLeft: 10,
  },
});
