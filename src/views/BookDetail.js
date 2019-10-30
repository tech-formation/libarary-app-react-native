import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import GlobalStyles from '../assets/styles/StyleSheet';
import { Icon } from 'react-native-elements';
import HeaderMenu from '../components/HeaderMenu';
import Spinner from 'react-native-loading-spinner-overlay';
import RNFS from 'react-native-fs';
import { showToast } from '../utils/helper';

export default class BookDetail extends Component {
  constructor(props) {
    super(props);
    this.input1 = React.createRef();
  }

  state = {
    is_loading: false,
    book_no: '',
    token: '',
    books: [],
    book: {},
  };

  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;

    return {
      title: 'Details',
      headerRight: (
        <View style={GlobalStyles.headerRightContainer}>
          <HeaderMenu navigate={navigate} />
        </View>
      ),
    };
  };

  componentDidMount() {
    this.getDb();
  }

  getDb = async () => {
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

      if (db != null) {
        const { books } = JSON.parse(db);
        this.setState({ books });
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
  scanBook = () => {
    const { book_no, books } = this.state;

    if (!book_no) {
      showToast('Please enter book no to scan.');
      return;
    }

    this.setState({ is_loading: true });
    const book = books.find(b => b.barcode == book_no);

    if (book) {
      this.setState({ is_loading: false, book });
      this.input1.clear();
      this.input1.focus();
    } else {
      this.setState({ is_loading: false });
      this.input1.clear();
      this.input1.focus();
      showToast('Record Not Found.');
    }
  };

  render() {
    const { book_no, is_loading, book } = this.state;

    return (
      <>
        <Spinner visible={is_loading} color="#8c1d1a" />

        <View style={styles.mainContainer}>
          <View style={[GlobalStyles.inputContainer, styles.inputContainer]}>
            <TextInput
              ref={obj => {
                this.input1 = obj;
              }}
              selectTextOnFocus={true}
              placeholder="Enter Book Number"
              underlineColorAndroid="transparent"
              style={[styles.textInput]}
              autoCapitalize="none"
              keyboardType="numeric"
              value={book_no}
              onSubmitEditing={() => this.scanBook()}
              onChangeText={value => {
                this.setState({ book_no: value });
              }}
            />
            <TouchableOpacity onPress={() => this.scanBook()}>
              <Icon name="send" color="#8c1d1a" />
            </TouchableOpacity>
          </View>

          {book.id && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailsTopRow}>
                <View style={styles.detailImageContainer}>
                  <Image
                    source={require('../assets/images/books.png')}
                    style={styles.booksImage}
                  />
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookSubTitle}>By: {book.author}</Text>
                  <Text style={styles.bookSubTitle}>
                    Barcode: {book.barcode}
                  </Text>
                </View>
              </View>
              <View style={styles.detailMidRow}>
                <Text style={styles.bookSubTitle}>
                  Staff Note: {book.staff_note}
                </Text>
                <Text style={[styles.bookSubTitle, styles.paddingLeft10]}>
                  Rack: {book.rack}
                </Text>
                <Text style={[styles.bookSubTitle, styles.paddingLeft10]}>
                  Side: {book.side}
                </Text>
              </View>
              <View style={styles.detailMidRow}>
                <Text style={styles.bookSubTitle}>
                  Location: {book.location}
                </Text>
                <Text style={[styles.bookSubTitle, styles.paddingLeft10]}>
                  BIB: {book.bib_id}
                </Text>
              </View>
              <View style={styles.detailMidRow}>
                <Text style={styles.bookSubTitle}>
                  Call No.: {book.call_number}
                </Text>
                <Text style={[styles.bookSubTitle, styles.paddingLeft10]}>
                  Coy No.: {book.copy_number}
                </Text>
              </View>
              <View style={styles.detailBottomRow}>
                <Text style={styles.bookDescription}>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </Text>
              </View>
            </View>
          )}
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
    margin: 10,
  },
  detailsTopRow: {
    flex: 0.15,
    flexDirection: 'row',
    paddingTop: 10,
  },
  detailImageContainer: {
    flex: 0.3,
    marginLeft: 25,
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
    flex: 0.04,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
  detailBottomRow: {
    flex: 0.5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },
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
