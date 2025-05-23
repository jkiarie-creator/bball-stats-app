import React from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './AppNavigator';
import { name as appName } from './app.json';

const App = () => <AppNavigator />;

AppRegistry.registerComponent(appName, () => App);
