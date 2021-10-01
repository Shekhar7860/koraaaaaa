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
class SelectAssignee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      assigneeList: emptyArray,
      selectedAssignee: '',
      mapValueGuest: {},
    };
  }

  componentDidMount() {
    input.current?.focus();
    this.setState({assigneeList: this.props.data});

    // this.props.getContactList();
    // this.props.selectedContactList([]);
    // this.props.getRecentContactList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        assigneeList: this.props.data,
      });
    }
  }
  openModal(assignee) {
    this.props.setSearchAssignee('');
    this.setState({searchValue: ''});
    this.setState({
      assigneeList: this.props.data,
      selectedAssignee: assignee,
    });
    this.assigneeRef.openBottomDrawer();
  }
  renderNoData = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Text>No results found</Text>
      </View>
    );
  };
  selectAssignee() {
    const {searchValue, assigneeList, selectedAssignee} = this.state;
    return (
      <View style={{marginBottom: 10}}>
        <View style={styles.mainView}>
          <Text style={styles.headerText}>Select Assignee</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.setTagsSelected(this.state.selectedAssignee);
              this.assigneeRef.closeBottomDrawer();
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
              this.props.setSearchAssignee(searchValue);
              this.setState({searchValue});
            }}
            placeholder="Search"
            placeholderTextColor={'#9AA0A6'}
            value={searchValue}
            style={styles.textInputStyle}
          />
        </View>
        <FlatList
          data={assigneeList}
          keyboardShouldPersistTaps="handled"
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
            return (
              <TouchableOpacity
                underlayColor="rgba(0,0,0,0.2)"
                onPress={() => {
                  this.props.setTagsSelected(item);
                  this.setState({selectedAssignee: item});
                }}
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  backgroundColor:
                    this.state.selectedAssignee.emailId === item?.emailId
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
                {this.state.selectedAssignee.emailId === item?.emailId ? (
                  <Icon
                    name={'SingleTick'}
                    size={normalize(24)}
                    color={'#0D6EFD'}
                    //style={styles.checkboxTickImg}
                  />
                ) : null}
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
          this.assigneeRef = ref;
        }}
        height={height - normalize(150)}>
        {this.selectAssignee()}
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
  checkboxTickImg: {
    width: '85%',
    height: '85%',
    tintColor: '#ffffff',
    resizeMode: 'contain',
  },
});

export default SelectAssignee;
