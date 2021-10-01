import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import {Icon} from '../../components/Icon/Icon.js';
import {getTimeline, normalize} from '../../utils/helpers';
import * as UsersDao from '../../../dao/UsersDao';
import {BottomUpModal} from '../../components/BottomUpModal';
import database from '../../realm';
import * as Entity from '../../../native/realm/dbconstants';
import {emptyArray} from '../../../shared/redux/constants/common.constants';
import {RoomAvatar} from '../../components/RoomAvatar';
import {Avatar} from '../../components/Icon/Avatar';
import {BottomUpModalShare} from '../../components/BottomUpModal/BottomUpModalShare';
const {height} = Dimensions.get('window');

const input = React.createRef();
class SelectWatchers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      watchersList: emptyArray,
      selectedWatchers: emptyArray,
      mapValueGuest: {},
    };
  }

  componentDidMount() {
    input.current?.focus();
    this.setState({watchersList: this.props.data});

    // this.props.getContactList();
    // this.props.selectedContactList([]);
    // this.props.getRecentContactList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        watchersList: this.props.data,
      });
    }
  }
  assignKeyValue(tagsSelectedArray) {
    var tempMap = {};
    for (let i = 0; i < tagsSelectedArray.length; i++) {
      tempMap[tagsSelectedArray[i]?.emailId] = tagsSelectedArray[i];
    }
    this.setState({mapValueGuest: tempMap});
  }
  openModal(watchers) {
    this.props.setSearchWatcher('');
    this.setState({searchValue: ''});
    this.assignKeyValue(this.props.tagsSelected);
    this.setState({
      watchersList: this.props.data,
    });
    this.watchersRef.openBottomDrawer();
  }
  getArrayValuesFromMap(mapArray) {
    let tempArray = [];
    Object.keys(mapArray).map(function (key, index) {
      tempArray.push(mapArray[key]);
    });
    return tempArray;
  }
  renderNoData = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Text>No results found</Text>
      </View>
    );
  };
  selectwatchers() {
    const {searchValue, watchersList, selectedWatchers} = this.state;
    return (
      <View style={{marginBottom: 10}}>
        <View style={styles.mainView}>
          <Text style={styles.headerText}>Select Watchers</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.setTagsSelected(
                this.getArrayValuesFromMap(this.state.mapValueGuest),
              );
              this.watchersRef.closeBottomDrawer();
            }}
            style={{padding: 10, marginRight: 10}}>
            <Text style={[styles.textStyle, {color: '#0D6EFD'}]}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10, marginHorizontal: 20}}>
          <TextInput
            ref={input}
            onChangeText={(searchValue) => {
              this.props.contactListData(searchValue);
              this.props.setSearchWatcher(searchValue);
              this.setState({searchValue});
            }}
            placeholder="Search"
            placeholderTextColor={'#9AA0A6'}
            value={searchValue}
            style={styles.textInputStyle}
          />
        </View>
        <FlatList
          data={watchersList}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item, index) => item.id || item._id}
          style={{
            paddingVertical: 5,
            height: '80%',
          }}
          ListEmptyComponent={this.state.searchValue && this.renderNoData}
          renderItem={({item}) => {
            let name;
            if (item?.fN) {
              name = item?.fN + ' ' + item?.lN;
            } else {
              name = item?.emailId;
            }
            //const {icon, fN, lN, emailId, color} = item;
            return (
              <TouchableOpacity
                underlayColor="rgba(0,0,0,0.2)"
                onPress={() => {
                  let value = this.state.mapValueGuest;
                  if (value[item.emailId] === undefined) {
                    //add itt
                    value[item.emailId] = item;
                    this.setState({mapValueGuest: value});
                  } else {
                    delete value[item.emailId];
                    this.setState({mapValueGuest: value});

                    //remove it
                  }
                }}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor:
                    this.state.mapValueGuest[item.emailId] !== undefined
                      ? '#F3F8FF'
                      : '#ffffff',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <Avatar
                    name={name}
                    color={item?.color}
                    profileIcon={item.icon}
                    userId={item._id}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      marginStart: 5,
                      width: '80%',
                      //flex: 1,
                      padding: 5,
                    }}>
                    <Text numberOfLines={1} style={styles.nameTextStyle}>
                      {name}
                    </Text>
                    <Text numberOfLines={1} style={styles.emailTextStyle}>
                      {item.emailId}
                    </Text>
                  </View>
                </View>
                <View style={styles.checkboxStyle}>
                  {this.state.mapValueGuest[item.emailId] !== undefined ? (
                    <View style={styles.selectedUI}>
                      <Icon
                        name={'SingleTick'}
                        size={normalize(14)}
                        color={'#fff'}
                        style={styles.checkboxTickImg}
                      />
                    </View>
                  ) : (
                    <View style={styles.uncheckedCheckbox} />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <BottomUpModalShare
        ref={(ref) => {
          this.watchersRef = ref;
        }}
        height={height - normalize(150)}>
        {this.selectwatchers()}
      </BottomUpModalShare>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    flex: 1,
    margin: 18,
    fontWeight: '500',
    fontSize: normalize(16),
    color: '#202124',
  },
  textStyle: {
    fontWeight: '500',
    fontSize: normalize(16),
  },
  nameTextStyle: {
    fontWeight: '400',
    fontSize: normalize(16),
    color: '#202124',
  },
  emailTextStyle: {
    fontWeight: '400',
    fontSize: normalize(14),
    color: '#5F6368',
  },
  frame6: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  frame5: {
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#F3F8FF',
    alignItems: 'center',
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E4E5E7',
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: '#E4E5E7',
    fontSize: normalize(16),
    borderRadius: 4,
    padding: 12,
    marginBottom: 5,
  },
  checkboxStyle: {
    height: 24,
    width: 24,
    top: 10,
    justifyContent: 'flex-end',
  },
  selectedUI: {
    borderRadius: 4,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D6EFD',
  },
  uncheckedCheckbox: {
    borderRadius: 4,
    flex: 1,
    backgroundColor: '#fff',
    borderColor: '#BDC1C6',
    borderWidth: 1,
  },
  checkboxTickImg: {
    width: '85%',
    height: '85%',
    tintColor: '#ffffff',
    resizeMode: 'contain',
  },
});

export default SelectWatchers;
