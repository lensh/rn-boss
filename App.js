import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import AppContainter from './src';
import appReducer from './src/reducer';

const middleware = createReactNavigationReduxMiddleware(state => state.nav);
const AppReduxContainer = createReduxContainer(AppContainter);

const mapStateToProps = state => ({
  state: state.nav,
});
const AppWithNavigationState = connect(mapStateToProps)(AppReduxContainer);

const store = createStore(appReducer, applyMiddleware(middleware));

class App extends Component {
  
  componentDidMount() {
    StatusBar.setBackgroundColor('rgb(29,216,200)');
  }
  
  render() {
    return (
      <Provider store={store} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <AppWithNavigationState />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
