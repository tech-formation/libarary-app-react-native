import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const ListItem = ({ data }) => {
  return (
    <View style={[styles.scene]}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View key={item.book_id} style={styles.listItem}>
            <Text style={styles.listItemTitle}>{item.title}</Text>
            <View style={[styles.listItemDetails, styles.inlineFlow]}>
              <View style={styles.inlineFlow}>
                <Text style={styles.listItemLabel}>By: </Text>
                <Text style={styles.listItemText}>{item.author}</Text>
              </View>
              <View style={styles.inlineFlow}>
                <Text style={[styles.listItemLabel, styles.leftPadding20]}>
                  ISBN:{' '}
                </Text>
                <Text style={styles.listItemText}>{item.isbn_number}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  listItem: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingLeft: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#a9a9a9',
    height: 60,
  },
  listItemTitle: {
    flex: 0.6,
    color: '#000',
    fontSize: 16,
  },
  listItemDetails: {
    flex: 0.4,
  },
  inlineFlow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listItemLabel: {
    color: '#a9a9a9',
  },
  listItemText: {
    color: '#808080',
  },
  leftPadding20: {
    paddingLeft: 20,
  },
});

export default ListItem;
