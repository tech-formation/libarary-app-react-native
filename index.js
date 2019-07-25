/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Login from './src/views/Login';
import Home from './src/views/Home';

AppRegistry.registerComponent(appName, () => Home);
