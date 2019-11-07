import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

export const truncate = input =>
  input.length > 45 ? `${input.substring(0, 45)}...` : input;

const ListItem = ({ data }) => {
  return (
    <View style={[styles.scene]}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View key={item.book_id} style={styles.listItem}>
            <Text style={styles.listItemTitle}>{truncate(item.title)}</Text>
            <View style={[styles.listItemDetails, styles.inlineFlow]}>
              <View style={styles.inlineFlow}>
                <Text style={styles.listItemLabel}>By:&nbsp;</Text>
                <Text style={styles.listItemText}>{item.author}</Text>
              </View>
              <View style={styles.inlineFlow}>
                <Text style={[styles.listItemLabel, styles.leftPadding20]}>
                  Staff Note:&nbsp;
                </Text>
                <Text style={styles.listItemText}>{item.staff_note}</Text>
              </View>
            </View>
            <View style={[styles.listItemDetails, styles.inlineFlow]}>
              <View style={styles.inlineFlow}>
                <Text style={[styles.listItemLabel]}>Call No:&nbsp;</Text>
                <Text style={styles.listItemText}>{item.call_number}</Text>
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
    paddingVertical: 8,
    paddingLeft: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#a9a9a9',
    height: 85,
  },
  listItemTitle: {
    flex: 0.5,
    color: '#000',
    fontSize: 16,
  },
  listItemDetails: {
    flex: 0.5,
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
