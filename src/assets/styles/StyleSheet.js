import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    width: 300,
    height: 500,
  },
  logoContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
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
    margin: 10,
  },
  inputIcon: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8c1d1a',
    width: 300,
    height: 40,
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  select: {
    width: 200,
    height: 40,
    top: 20,
  },
  buttonText: {
    color: '#fff',
  },
  largeText: {
    fontSize: 30,
  },
  verticalSpace: {
    height: 30,
  },
  headerRightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRightButton: {
    borderWidth: 1,
    padding: 5,
    borderColor: '#fff',
    borderRadius: 5,
    right: 5,
  },
  menuText: {
    color: '#808080',
  },
});
