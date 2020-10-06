import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';

class My extends Component {
  static navigationOptions = {
    headerTitle: '我的',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>我的</Text>
      </View>
    );
  }
}

const MyStackNavigator = createStackNavigator(
  {
    Message: {
      screen: My,
    }
  },
  {
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: 'white',
      },
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'rgb(29,216,200)',
      },
      gestureEnabled: true,
      gestureResponseDistance: 100,
    },
  },
);

export default MyStackNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});