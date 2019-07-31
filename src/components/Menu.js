import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import GlobalStyles from '../assets/styles/StyleSheet';

const menu_data = [
  { id: 1, icon: 'lock', title: 'Change Password' },
  { id: 2, icon: 'input', title: 'Logout' },
];

class Menu extends React.Component {
  state = {
    is_modal_visible: false,
  };

  render() {
    const { is_modal_visible } = this.state;
    return (
      <>
        <View style={styles.menuContainer}>
          <View style={[styles.menu]}>
            <FlatList
              data={menu_data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.menuItem}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.id == 1) {
                        this.setState({ is_modal_visible: true });
                      }
                    }}
                    style={styles.menuItemInner}
                  >
                    <View style={styles.menuIcon}>
                      <Icon name={item.icon} color="#a9a9a9" size={16} />
                    </View>
                    <View style={styles.menuTitle}>
                      <Text>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>

        <View style={styles.container}>
          <Modal
            onSwipeComplete={() => this.setState({ is_modal_visible: false })}
            swipeDirection="right"
            isVisible={is_modal_visible}
          >
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Old Password"
                  autoCapitalize="none"
                  onChangeText={value => {
                    this.setState({ username: value });
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="New Password"
                  secureTextEntry={true}
                  autoCompleteType="password"
                  onChangeText={value => {
                    this.setState({ password: value });
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  autoCompleteType="password"
                  onChangeText={value => {
                    this.setState({ password: value });
                  }}
                  underlineColorAndroid="transparent"
                />
              </View>
              <TouchableOpacity
                onPress={this.handleLoginRequest}
                style={styles.button}
              >
                <View>
                  <Text style={GlobalStyles.buttonText}>Change Password</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  menu: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
  },
  menuIcon: {
    paddingRight: 8,
  },
  menuItemInner: {
    display: 'flex',
    flexDirection: 'row',
  },
  formContainer: {
    height: 230,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },

  textInput: {
    flex: 1,
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#a9a9a9',
    height: 40,
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#8c1d1a',
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
});

export default Menu;
