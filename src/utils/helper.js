import Toast from 'react-native-simple-toast';

/**
 * Shows toast message at bottom
 * @param {String} message
 */
export const showToast = message => {
  Toast.show(message);
};

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
