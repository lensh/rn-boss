import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeStackNavigator from './Home/index';
import CompanyStackNavigator from './Company/index';
import Message from './Message';
import My from './My';
import { createStackNavigator } from 'react-navigation-stack';
import WelcomePage from './Welcome/index';

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStackNavigator,
      navigationOptions: {
        tabBarLabel: '职位',
      },
    },
    Company: {
      screen: CompanyStackNavigator,
      navigationOptions: {
        tabBarLabel: '公司',
      },
    },
    Message: {
      screen: Message,
      navigationOptions: {
        tabBarLabel: '消息',
      },
    },
    // My: {
    //   screen: My,
    //   navigationOptions: {
    //     tabBarLabel: '我的',
    //   },
    // },
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'globe';
        } else if (routeName === 'Company') {
          iconName = 'building-o';
        } else if (routeName === 'Message') {
          iconName = 'comments-o';
        } else if (routeName === 'My') {
          iconName = 'user-circle-o';
        }
        return <FontAwesome name={iconName} size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'rgb(29,216,200)',
      inactiveTintColor: 'gray',
    },
  },
);

const AppInitNavigator = createStackNavigator({
  welcome: {
    screen: WelcomePage,
    navigationOptions: {
      headerShown: false
    }
  }
});

const switchNavigator = createSwitchNavigator({
  Init: AppInitNavigator,
  Main: TabNavigator,
}, {
  initialRouteName: 'Init'
});

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
