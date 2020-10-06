import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableHighlight,
  ImageBackground,
  Dimensions,
  RefreshControl
} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {connect} from 'react-redux';
import {setMessageList, updateMessageList, changeLoading} from './actions';
import {fetchGet} from '../util/http';
import {APIS, APP} from '../constants/API';

const wWidth = Dimensions.get('window').width;

class Message extends Component {
  static navigationOptions = {
    headerTitle: '消息',
  };
  constructor(props) {
    super(props);
    this.state = {
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefesh: false
    };
  }

  componentDidMount() {
    const {page} = this.props;
    this.fetchMessage(page, true);
  }

  fetchMessage = (curPage, firstLoad) => {

    if(firstLoad) {
      const { changeLoading } = this.props;
      changeLoading({
        isLoading: true
      })
    }

    const requestParam = {
      ...APP,
      page: curPage,
    };
    fetchGet({
      serviceType: APIS.ServiceInit,
      params: requestParam,
      success: response => {
        const {setMessageList, updateMessageList} = this.props;
        if (curPage === 1) {
          setMessageList({
            list: response.list,
            page: curPage,
            isLoading: false
          });
          this.setState({
            isRefesh: false
          });
        } else {
          let foot = 0;
          const { messageList } = this.props;
          updateMessageList({
            list: messageList.concat(response.list),
            page: curPage,
            isLoading: false
          });
          this.setState({ showFoot: foot });
        }
      },
      fail: response => {
        console.log('fail response', response);
      },
      error: error => {
        console.log('error', error);
      },
    });
  };

  /** 上拉刷新 */
  _onEndReached = ({ distanceFromEnd }) => {
    console.log('_onEndReached', this.state, distanceFromEnd);
    const { showFoot } = this.state;
    //如果是正在加载中或没有更多数据了，则返回
    if (showFoot !== 0) {
      return;
    }
    const { page, updateMessageList } = this.props;
    const curPage = page + 1;
    updateMessageList({
      page: curPage,
    });
    //底部显示正在加载更多数据
    this.setState({ showFoot: 2 });
    this.fetchMessage(curPage);
  };

  _onRefeshData = () => {
    this.setState({
      isRefesh: true
    });
    //清空数据
    this.fetchMessage(1);
  }

  /** 上拉展示Footer */
  _renderFooter = () => {
    const { showFoot } = this.state;

    if (showFoot === 1) {
      // 无数据
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>没有更多数据了</Text>
        </View>
      );
    } else if (showFoot === 2) {
      // 正在加载
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text style={styles.footerText}>正在加载更多数据...</Text>
        </View>
      );
    } else if (showFoot === 0) {
      // 空View
      return <View style={styles.footer} />;
    }
  };

  _renderItem = ({item, index, separators}) => {
    return (
      <TouchableHighlight
        style={styles.itemContent}>
        <View>
          <View style={styles.pNameContent}>
            <ImageBackground
              style={styles.pImage}
              source={{uri: item.logo_url}}
            />
            <Text
              style={styles.pName}
              numberOfLines={1}
              ellipsizeMode="tail">{`${item.name}`}</Text>
            <Text style={styles.pSalary}>有兴趣来我们公司面试吗</Text>
          </View>
          <View style={styles.pLine} />
          <Text style={styles.pHr}>{`${item.single_word}`}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  _keyExtractor = (item, index) => `default_${item.name}_${index}`;

  _renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyContent}>
        <Text style={{fontSize: 16}}>暂无数据下拉刷新</Text>
      </View>
    );
  };

  render() {
    const {isLoading, messageList} = this.props;
    console.log('render', messageList);
    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator animating={true} color="blue" size="large" />
        ) : (
          <FlatList
            style={styles.contentList}
            data={messageList}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={({highlighted}) => (
              <View style={styles.separator} />
            )}
            ListEmptyComponent={this._renderListEmptyComponent}
            ListFooterComponent={this._renderFooter}
            initialNumToRender={8}
            getItemLayout={(item, index) => ({
              length: ITEM_HEIGHT + SEPERATOR_HEIGHT,
              offset: (ITEM_HEIGHT + SEPERATOR_HEIGHT) * index,
              index,
            })}
            initialScrollIndex={0}
            onEndReachedThreshold={0.1}
            onEndReached={this._onEndReached}
            refreshControl={
              <RefreshControl 
              title='loading...'
              refreshing={this.state.isRefesh}
              // colors={['red']}
              tintColor= 'red'
              titleColor= 'red'
              onRefresh={()=>{
                this._onRefeshData();
              }}/>
            }
          />
        )}
      </View>
    );
  }
}

const MessageScreen = connect(
  state => ({
    page: state.messageList.page,
    messageList: state.messageList.list,
    isLoading: state.messageList.isLoading,
  }),
  {setMessageList, updateMessageList, changeLoading},
)(Message);

const MessageStackNavigator = createStackNavigator(
  {
    Message: {
      screen: MessageScreen,
      navigationOptions: {
        tabBarLabel: '消息',
      },
    },
  },
  {
    initialRouteName: 'Message',
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
    navigationOptions: {
      tabBarVisible: true,
    },
  },
);

export default MessageStackNavigator;

const ITEM_HEIGHT = 130;
const SEPERATOR_HEIGHT = StyleSheet.hairlineWidth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContent: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentList: {
    width: wWidth,
    flex: 1,
    backgroundColor: 'rgb(241,242,246)',
  },
  separator: {
    height: 5,
    alignSelf: 'stretch',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'column',
    height: ITEM_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pImage: {
    width: 40,
    height: 40,
  },
  pNameContent: {
    height: 80,
    alignItems: 'center',
    flexDirection: 'row',
  },
  pName: {
    fontSize: 12,
    width: 100,
  },
  pSalary: {
    textAlignVertical: 'center',
    fontSize: 16,
    color: 'grey',
  },
  pLine: {
    marginTop: 10,
    height: SEPERATOR_HEIGHT,
    backgroundColor: '#e0e0e0',
  },
  pHr: {
    marginTop: 10,
    height: 20,
    fontSize: 12,
    color: 'rgb(29,216,200)',
  },
  footer: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerText: {
    color: '#999999',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
});
