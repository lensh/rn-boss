import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import { setCompanyList } from './actions';

import { companyList } from '../data';

const wWidth = Dimensions.get('window').width;

class CompanyScreen extends Component {
  static navigationOptions = {
    headerTitle: '公司',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      const { setCompanyList } = this.props;
      setCompanyList({ list: companyList.list, isLoading: false });
    }, 1000);
  }

  handlePress = item => event => {
    this.props.navigation.navigate('CompanyDetail', { company: item });
  };

  _renderItem = ({ item, index, separators }) => {
    console.log('item', item, index);
    return (
      <TouchableHighlight
        style={styles.itemContent}
        key={`item_${item.name}_${index}`}
        onPress={this.handlePress(item)}>
        <View>
          <View style={styles.pNameContent}>
            <Text style={styles.pSalary}>{`${item.type}|${item.size}|${item.employee
              }`}</Text>
            <View style={styles.company}>
              <ImageBackground style={styles.pImage} source={{ uri: item.logo }} />
              <Text style={styles.pName}>{`${item.location}`}</Text>
            </View>
          </View>
          <View style={styles.pLine} />
          <Text style={styles.pHr}>{`热招：${item.hot} 等${item.count
            }个职位`}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  _keyExtractor = (item, index) => `default_${item.name}_${index}`;

  _renderListEmptyComponent = () => {
    return (
      <View style={styles.emptyContent}>
        <Text style={{ fontSize: 16 }}>暂无数据下拉刷新</Text>
      </View>
    );
  };

  render() {
    const { isLoading } = this.props;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator animating={true} color="blue" size="large" />
        ) : (
            <FlatList
              style={styles.contentList}
              contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
              data={this.props.companyList}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              ItemSeparatorComponent={({ highlighted }) => (
                <View style={styles.separator} />
              )}
              ListEmptyComponent={this._renderListEmptyComponent}
              initialNumToRender={8}
              getItemLayout={(item, index) => ({
                length: ITEM_HEIGHT + SEPERATOR_HEIGHT,
                offset: (ITEM_HEIGHT + SEPERATOR_HEIGHT) * index,
                index,
              })}
              initialScrollIndex={0}
              // refreshing={isRefreshing}
              // onEndReachedThreshold={0.1}
              // onEndReached={this._onEndReached}
              // onRefresh={this._onRefresh}
              removeClippedSubviews
            />
          )}
      </View>
    );
  }
}

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
    alignItems: 'flex-start',
    flexDirection:'column',
    justifyContent:"center"
  },
  company:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:10
  },
  pName: {
    fontSize: 12,
    marginLeft:10
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
});

export default connect(
  state => ({
    companyList: state.companyList.list,
    isLoading: state.companyList.isLoading,
  }),
  {
    setCompanyList,
  },
)(CompanyScreen);
