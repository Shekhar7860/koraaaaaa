/**
 * WorkAssist React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, Suspense} from 'react';
import {Provider} from 'react-redux';
import {Linking} from 'react-native';
import {store} from './src/shared/redux/store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AppStackNavigator,
  FindlyNavigator,
  NewWorkspacesNavigator,
} from './src/native/navigation/RootNavigator';

if (__DEV__) {
  import('./reactotron-config').then(() =>
    console.log('Reactotron configured'),
  );
}

const Stack = createStackNavigator();

import {
  navigationRef,
  isReadyRef,
} from './src/native/navigation/NavigationService';
import './src/shared/i18n';
import {LogBox} from 'react-native';
import {ROUTE_NAMES} from './src/native/navigation/RouteNames';
import {Toast, toastRef} from './src/native/components/Toast';
import {overrideTextRender} from './src/native/utils/overrides';
import NoNetworkBar from './src/native/components/NoNetworkBar';

import {pushNotifData} from './src/shared/redux/actions/home.action';
import {Loader} from './src/native/screens/ChatsThreadScreen/ChatLoadingComponent';

overrideTextRender();

//kora-Main->Main->Chat
const deepLinksConf = {
  screens: {
    Kora: {
      screens: {
        Main: {
          screens: {
            Main: {
              screens: {
                // Chat: 'myChat/:boardId',
                // Main: 'myMain/:boardId',
              },
            },
          },
        },
        Login: {
          screens: {
            Splash: 'splash/:customData',
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['korav2://app.koraapp.com'],
  config: deepLinksConf,
};
export default class App extends Component {
  componentDidMount() {
    if (this.props?.userInteraction && this.props?.userInfo) {
      let _params = {
        notifData: this.props?.userInfo,
      };
      store.dispatch(pushNotifData(_params));
    }
  }

  render() {
    // if (!__DEV__) {
    LogBox.ignoreAllLogs();
    // }
    return (
      <Provider store={store}>
        <Toast ref={toastRef} />
        <Suspense fallback={<Loader />}>
          <NoNetworkBar />
          <NavigationContainer
            linking={linking}
            ref={navigationRef}
            onReady={() => {
              isReadyRef.current = true;
            }}>
            <Stack.Navigator
              headerMode="none"
              initialRouteName="Kora"
              mode="modal">
              <Stack.Screen name="Kora" component={AppStackNavigator} />
              <Stack.Screen
                name={ROUTE_NAMES.FINDLY}
                component={FindlyNavigator}
              />
              <Stack.Screen
                name={ROUTE_NAMES.NEW_WORKSPACE}
                component={NewWorkspacesNavigator}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Suspense>
      </Provider>
    );
  }
}
