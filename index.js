import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/views/Login';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

AppRegistry.registerComponent(appName, () => App);
