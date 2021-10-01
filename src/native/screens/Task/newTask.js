import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
  FlatList,
  Alert,
} from 'react-native';
import {isIOS} from '../../utils/PlatformCheck';
// import * as UsersDao from '../../../../dao/UsersDao';
import {Icon} from '../../components/Icon/Icon.js';
import {getTimeline, normalize} from '../../utils/helpers';
import SelectTaskWorkspaces from './selectTaskWorkspace';
import SelectPriority from './selectPriority';
import SelectStatus from './selectStatus';
import SelectWatchers from './selectWatchers';
import SelectAssignee from './selectAssignee';
import SelectDueDate from './selectDueDate';
// import {Header} from '../../../navigation/TabStacks';
// import moment from 'moment';
// import {create, merge} from 'lodash';
import {createTask} from '../../../shared/redux/actions/meetings.action';
import {navigate, goBack} from '../../navigation/NavigationService';
import {ROUTE_NAMES} from '../../navigation/RouteNames';
import {Avatar} from '../../components/Icon/Avatar';
import Toast from 'react-native-simple-toast';
import * as ContactsDao from '../../../dao/ContactsDao';
import {emptyArray} from '../../../shared/redux/constants/common.constants';
import {
  getContactList,
  getRecentContactList,
} from '../../../shared/redux/actions/create-message.action';
import {RoomAvatar} from '../../components/RoomAvatar';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const workspaceRef = React.createRef();
const priorityRef = React.createRef();
const statusRef = React.createRef();
const watchersRef = React.createRef();
const assigneeRef = React.createRef();
const dueDateRef = React.createRef();
const headerData = [
  {
    icon: 'Font',
    title: 'Task',
    id: 'task',
  },
  {
    icon: 'Contacts',
    title: 'Assignee',
    id: 'assignee',
  },
  {
    icon: 'DateTime',
    title: 'Due Date',
    id: 'due_date',
  },
  {
    icon: 'Open',
    title: 'Priority',
    id: 'priority',
  },
  {
    icon: 'Open',
    title: 'Status',
    id: 'status',
  },
  {
    icon: 'Notes',
    title: 'Details',
    id: 'details',
  },
  {
    icon: 'Contacts',
    title: 'Watchers',
    id: 'watchers',
  },
];
class CreateTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskTitle: '',
      taskDetail: '',
      detailInputFocused: false,
      workspace: '',
      table: '',
      watchers: emptyArray,
      assignee: '',
      priority: '',
      status: '',
      searchWatcherName: '',
      searchAssigneeName: '',
      dueDate: '',
    };
  }
  componentDidMount() {}

  createTask() {
    console.log('Task creation...');
    let {
      taskTitle,
      assignee,
      dueDate,
      priority,
      status,
      taskDetail,
      watchers,
    } = this.state;
    let payload = {title: taskTitle};
    if (assignee) {
      payload.assignTo = assignee.id;
    }
    if (dueDate) {
    }
    if (priority) {
      payload.priority = priority.title;
    }
    // if (status) {
    //   payload.status = status.title.trim();
    // }
    if (taskDetail) {
      payload.content = taskDetail.trim();
    }
    // if(watchers.length >0){
    //   let watchersId={};
    //   payload.watchers=
    // }
    this.props.createTask(null, payload);
  }

  renderHeader() {
    return (
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name={'cross'} size={24} color={'#292929'} />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Task</Text>
        <TouchableOpacity
          onPress={() => {
            this.state.taskTitle ? this.createTask() : null;
          }}
          style={{padding: 10, marginRight: 10}}>
          <Text
            style={{
              fontWeight: '500',
              fontSize: normalize(16),
              color: this.state.taskTitle ? '#0D6EFD' : '#9AA0A6',
            }}>
            Create
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  selectWorkspace() {
    let {workspace, table} = this.state;
    let name = workspace?.name?.trim() + ' / ' + table?.name;
    return (
      <TouchableOpacity
        onPress={() => {
          workspaceRef.current?.openModal(this.state.workspace);
        }}
        style={workspace ? styles.workspaceView2 : styles.workspaceView1}>
        {workspace ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RoomAvatar
              showCircle={false}
              boardIcon={workspace?.logo}
              size={22}
            />
            <Text style={styles.workspaceTitleText}>{name}</Text>
          </View>
        ) : (
          <>
            <View style={{paddingLeft: 20, paddingRight: 15}}>
              <Icon name={'traceInfo'} size={24} color="#26344A" />
            </View>

            <Text style={styles.workspaceText}>Select Workspace</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }
  addTaskName() {
    return (
      <TextInput
        //ref={}
        value={this.state.taskTitle}
        placeholder="Enter text"
        placeholderTextColor={'#9AA0A6'}
        style={styles.textInputStyle}
        onChangeText={(taskTitle) => this.setState({taskTitle})}
      />
    );
  }

  addDetails() {
    return (
      <TextInput
        multiline={true}
        onFocus={() => this.setState({detailInputFocused: true})}
        onBlur={() => this.setState({detailInputFocused: false})}
        value={this.state.taskDetail}
        placeholder="Enter text"
        placeholderTextColor={'#9AA0A6'}
        style={[
          styles.textInputStyle,
          {paddingTop: this.state.detailInputFocused ? 11 : 12},
        ]}
        onChangeText={(taskDetail) => this.setState({taskDetail})}
      />
    );
  }

  selectAssignee() {
    let {assignee} = this.state;
    return (
      <TouchableOpacity
        style={styles.boxStyle}
        onPress={() => {
          this.props.getRecentContactList();
          assigneeRef.current?.openModal(this.state.assignee);
        }}>
        {this.state.assignee ? (
          <View
            style={[styles.viewStyle4, {marginVertical: -5, marginBottom: -5}]}>
            <Avatar
              name={assignee?.fN}
              color={assignee?.color}
              profileIcon={assignee?.icon}
              userId={assignee?.id}
              rad={24}
            />
            <View style={{maxWidth: '75%'}}>
              <Text numberOfLines={1} style={styles.blackText}>
                {assignee?.fN + ' ' + assignee?.lN}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.crossView}
              onPress={() => this.setState({assignee: ''})}>
              <Icon name={'cross'} size={18} color={'#202124'} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.greyText, {flex: 1}]}>Select user</Text>
            <Icon
              name={'Contact_Addparticipant'}
              size={normalize(24)}
              color="#9AA0A6"
            />
          </>
        )}
      </TouchableOpacity>
    );
  }

  selectDateTime() {
    return (
      <TouchableOpacity
        style={styles.boxStyle}
        onPress={() => dueDateRef.current?.openModal(this.state.dueDate)}>
        {this.state.dueDate?.date ? (
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.viewStyle3}>
              <Text style={styles.dateTextStyle}>
                {getTimeline(this.state.dueDate?.date, 'numberDate')}
              </Text>
            </View>
            {this.state.dueDate?.time ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.dateTextStyle, {paddingHorizontal: 10}]}>
                  at
                </Text>
                <View
                  onPress={() => this.setState({showCalendar: false})}
                  style={styles.viewStyle3}>
                  <Text style={styles.dateTextStyle}>
                    {this.state.dueDate?.time}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={[styles.greyText, {flex: 1}]}>
            Select any date & time
          </Text>
        )}
        <Icon name={'Events'} size={normalize(24)} color="#9AA0A6" />
      </TouchableOpacity>
    );
  }

  renderUser = ({item, index}) => {
    return (
      <View style={styles.viewStyle4}>
        <Avatar
          name={item?.name}
          color={item?.color}
          profileIcon={item?.profileIcon}
          userId={item?.id}
          rad={24}
        />
        <View style={{maxWidth: '75%'}}>
          <Text numberOfLines={1} style={styles.blackText}>
            {item?.name}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.crossView}
          onPress={() => this.removeWatcher(item)}>
          <Icon name={'cross'} size={18} color={'#202124'} />
        </TouchableOpacity>
      </View>
    );
  };

  selectWatchers() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.getRecentContactList();
          watchersRef.current?.openModal(this.state.watchers);
        }}
        style={styles.boxStyle}>
        <FlatList
          ListEmptyComponent={this.renderNoData}
          data={this.state.watchers}
          renderItem={this.renderUser}
        />
        <Icon
          name={'Contact_Addparticipant'}
          size={normalize(24)}
          color="#9AA0A6"
        />
      </TouchableOpacity>
    );
  }

  selectPriority() {
    return (
      <TouchableOpacity
        style={[styles.boxStyle, {padding: this.state.priority ? 5 : 11}]}
        onPress={() => priorityRef.current?.openModal(this.state.priority)}>
        {this.state.priority ? (
          <View
            style={[
              styles.viewStyle2,
              {
                backgroundColor: this.state.priority?.color,
              },
            ]}>
            <Text
              style={[
                styles.titleText,
                {color: '#ffffff', paddingHorizontal: 12},
              ]}>
              {this.state.priority?.title}
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.greyText, {flex: 1}]}>Select</Text>
            <Icon name={'DownArrow'} size={normalize(16)} color="#5F6368" />
          </>
        )}
      </TouchableOpacity>
    );
  }

  selectStatus() {
    return (
      <TouchableOpacity
        onPress={() => statusRef.current?.openModal(this.state.status)}
        style={[styles.boxStyle, {padding: this.state.status ? 5 : 11}]}>
        {this.state.status ? (
          <View
            style={[
              styles.viewStyle2,
              {backgroundColor: this.state.status?.color},
            ]}>
            <Text
              style={[
                styles.titleText,
                {color: '#ffffff', paddingHorizontal: 12},
              ]}>
              {this.state.status?.title}
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.greyText, {flex: 1}]}>Select</Text>
            <Icon name={'DownArrow'} size={normalize(16)} color="#5F6368" />
          </>
        )}
      </TouchableOpacity>
    );
  }

  renderNoData = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.greyText}>People</Text>
      </View>
    );
  };

  renderContent(data) {
    switch (data.id) {
      case 'task':
        return this.addTaskName();
      case 'assignee':
        return this.selectAssignee();
      case 'due_date':
        return this.selectDateTime();
      case 'priority':
        return this.selectPriority();
      case 'status':
        return this.selectStatus();
      case 'details':
        return this.addDetails();
      case 'watchers':
        return this.selectWatchers();
      default:
        return;
    }
  }
  setTaskWorkspace = (workspace, table) => {
    this.setState({workspace, table});
  };

  addWatchers(watchersList) {
    let watchers = [];
    watchersList.map((item) => {
      //let payloadFormat = {emailId: item.emailId, optional: false};
      // let userDetail, name;
      // if (item.source === 'profile') {
      //   userDetail = item;
      //   name = userDetail?.emailId;
      // } else {
      //   userDetail = item;
      //   // ContactsDao.getContactFromEmailID(item.emailId);
      //   name = userDetail?.fN + ' ' + userDetail?.lN;
      // }
      let members = {
        emailId: item?.emailId,
        name: item?.fN + ' ' + item?.lN,
        id: item?._id,
        profileIcon: item?.icon,
        color: item?.color,
      };
      let index = this.state.watchers.findIndex(
        (t) => t.emailId === item.emailId,
      );
      //console.log('Index', index);
      if (index === -1) {
        watchers = watchers.concat([members]);
      }
    });

    //console.log('Contact', JSON.stringify(payloadFormat));

    // let watchersTemp = this.state.attendees.concat([...attendees]);
    let watchersTemp = this.state.watchers.concat([...watchers]);
    this.setState({
      watchers: this.filterUsers(watchersTemp, watchersList),
    });
  }

  filterUsers(varWatchersList, array2) {
    let watchers = [];
    let emailIds = [];
    for (let i = 0; i < varWatchersList.length; i++) {
      for (let j = 0; j < array2.length; j++) {
        if (varWatchersList[i].emailId === array2[j].emailId) {
          if (emailIds.indexOf(varWatchersList[i].emailId) <= -1) {
            watchers.push(varWatchersList[i]);
            emailIds.push(varWatchersList[i].emailId);
          }
        }
      }
    }
    return watchers;
  }

  removeWatcher(contact) {
    const index = this.state.watchers?.findIndex(
      (a) => a.emailId === contact.emailId,
    );
    //let array1 = [...this.state.attendees];
    let array2 = [...this.state.watchers];
    if (index >= 0) {
      //array1.splice(index, 1);
      array2.splice(index, 1);
    }

    this.setState({
      //attendees: array1,
      watchers: array2,
    });
  }

  render() {
    //console.log('Workspaces', this.state.workspace.members);
    // const {} = this.state;
    //const {} = this.props?.route?.params;
    return (
      <SafeAreaView style={styles.container}>
        <SelectTaskWorkspaces
          ref={workspaceRef}
          isWorkspace={this.state.workspace}
          setTaskWorkspace={this.setTaskWorkspace}
        />
        <SelectPriority
          ref={priorityRef}
          setPriority={(priority) => this.setState({priority})}
        />
        <SelectStatus
          ref={statusRef}
          setStatus={(status) => this.setState({status})}
        />
        <SelectWatchers
          ref={watchersRef}
          isWatchers={this.state.watchers}
          setTagsSelected={(contacts) => {
            if (contacts.length === 0) {
              this.setState({watchers: []});
            } else {
              this.addWatchers(contacts);
            }
            //this.setState({watchers: contacts});
          }}
          tagsSelected={this.state.watchers}
          data={
            this.state.searchWatcherName === ''
              ? this.props.recentData
              : this.props.contactlistData
          }
          contactListData={(guestName) => {
            this.props.getContactList(guestName);
          }}
          setSearchWatcher={(guestName) =>
            this.setState({searchWatcherName: guestName})
          }
        />
        <SelectAssignee
          ref={assigneeRef}
          isAssignee={this.state.assignee}
          setTagsSelected={(assignee) => {
            this.setState({assignee});
          }}
          data={
            this.state.searchAssigneeName === ''
              ? this.props.recentData
              : this.props.contactlistData
          }
          contactListData={(guestName) => {
            this.props.getContactList(guestName);
          }}
          setSearchAssignee={(guestName) =>
            this.setState({searchAssigneeName: guestName})
          }
        />
        <SelectDueDate
          ref={dueDateRef}
          setDueDate={(dueDate) => this.setState({dueDate})}
        />
        {this.renderHeader()}
        <KeyboardAvoidingView
          style={{flex: 1}}
          enabled={true}
          keyboardVerticalOffset={-30}
          behavior={isIOS ? 'padding' : null}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            ref={(ref) => {
              this.scrollView = ref;
            }}
            onContentSizeChange={(w, h) => {
              // console.log('Size changed', this.state.detailInputFocused);
              if (this.state.detailInputFocused) {
                this.scrollView.scrollTo({animated: true, x: 0, y: h - 520});
              }
            }}
            style={{marginBottom: 15}}>
            {this.selectWorkspace()}
            <View style={{marginVertical: 10}}>
              {headerData.map((item) => {
                return (
                  <View style={{marginVertical: 10, marginHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name={item?.icon} size={24} color="#9AA0A6" />
                      <Text style={[styles.titleText, {marginLeft: 9}]}>
                        {item?.title}
                      </Text>
                    </View>
                    {/* {this.renderTask()} */}
                    {this.renderContent(item)}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    fontStyle: 'normal',
    marginLeft: 10,
    flex: 1,
  },
  workspaceTitleText: {
    fontWeight: '400',
    fontSize: normalize(16),
    marginLeft: 10,
  },
  headerView: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E5E7',
  },
  workspaceView1: {
    paddingVertical: 14.33,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEA',
  },
  workspaceView2: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginLeft: 20,
  },
  workspaceText: {
    fontSize: normalize(16),
    color: '#202124',
    textDecorationLine: 'underline',
  },
  titleText: {
    fontWeight: '500',
    fontSize: normalize(16),
    color: '#202124',
  },
  textInputStyle: {
    width: width - 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E4E5E7',
    fontSize: normalize(16),
    borderRadius: 4,
    padding: 12,
    paddingLeft: 10,
  },
  boxStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    width: width - 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E4E5E7',
    borderRadius: 4,
  },
  viewStyle2: {
    padding: 8,
    borderRadius: 24,
    marginLeft: 5,
  },
  greyText: {fontSize: normalize(16), fontWeight: '400', color: '#9AA0A6'},
  blackText: {
    fontSize: normalize(16),
    fontWeight: '400',
    color: '#202124',
    marginLeft: 5,
  },
  viewStyle3: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#EFF0F1',
  },
  dateTextStyle: {
    fontWeight: '400',
    fontSize: normalize(16),
  },
  viewStyle4: {
    backgroundColor: '#E7F1FF',
    padding: 5,
    flexDirection: 'row',
    borderRadius: 80,
    marginBottom: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  crossView: {padding: 5, marginLeft: 5},
});

const mapStateToProps = (state) => {
  const {createMessage} = state;
  return {
    contactlistData: createMessage.contactlistData || emptyArray,
    recentData: createMessage.recentData || emptyArray,
  };
};

export default connect(mapStateToProps, {
  getContactList,
  getRecentContactList,
  createTask,
})(CreateTask);
