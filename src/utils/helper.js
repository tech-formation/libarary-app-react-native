import Toast from 'react-native-simple-toast';

/**
 * Shows toast message at bottom
 * @param {String} message
 */
export const showToast = message => {
  Toast.show(message);
};
