import React from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

const menu_data = [
  { id: 1, icon: 'lock', title: 'Change Password' },
  { id: 2, icon: 'input', title: 'Logout' },
];

const Menu = () => {
  return (
    <View style={styles.menuContainer}>
      <View style={[styles.menu]}>
        <FlatList
          data={menu_data}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.menuItem}>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon name={item.icon} color="#a9a9a9" size={16} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuTitle}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  menuTitle: {},
});

export default Menu;
