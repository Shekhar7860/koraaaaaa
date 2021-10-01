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
} from 'react-native';
import {Icon} from '../../components/Icon/Icon.js';
import {getTimeline, normalize} from '../../utils/helpers';
import * as UsersDao from '../../../dao/UsersDao';
import {BottomUpModal} from '../../components/BottomUpModal';
import database from '../../realm';
import * as Entity from '../../../native/realm/dbconstants';
import {emptyArray} from '../../../shared/redux/constants/common.constants';
import {RoomAvatar} from '../../components/RoomAvatar';
import {BottomUpModalShare} from '../../components/BottomUpModal/BottomUpModalShare';
import * as BoardsDao from '../../../dao/BoardsDao';

const input = React.createRef();
class SelectTaskWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      workspacelist: emptyArray,
      selectedWorkspace: emptyArray,
      selectedTable: emptyArray,
      showTables: false,
      tables: emptyArray,
    };
  }

  openModal(workspace) {
    this.subscribeWorkspaces();
    //this.setState({showTables: false});
    this.workspaceRef.openBottomDrawer();
  }

  subscribeWorkspaces = () => {
    try {
      if (this.wsSubscription && this.wsSubscription.unsubscribe) {
        this.wsSubscription.unsubscribe();
      }

      const db = database.active;
      this.wsObservable = db.collections
        .get(Entity.Workspaces)
        .query()
        .observeWithColumns(['updated_at']);
      this.wsSubscription = this.wsObservable.subscribe((workspaces) => {
        this.setState({workspacelist: workspaces});
      });
    } catch (e) {
      console.log('error in subscribeWorkspaces', e);
    }
  };
  getBoardTables = async (workspaceId) => {
    // console.log('ID===>', workspaceId);
    var tables = await BoardsDao.getBoardTables(workspaceId);
    //let member = await board.members.fetch();
    // console.log('Tables====>', tables);
    this.setState({tables});
  };

  selectWorkspace() {
    const {searchValue, workspacelist, selectedWorkspace} = this.state;
    return (
      <View style={styles.viewStyle2}>
        <View style={styles.mainView}>
          <Text style={styles.headerText}>Select Workspace</Text>
          <TouchableOpacity onPress={() => {}} style={styles.viewStyle1}>
            <Text style={[styles.textStyle, {color: '#9AA0A6'}]}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10, marginHorizontal: 20}}>
          <TextInput
            ref={input}
            onChangeText={(searchValue) => this.setState({searchValue})}
            placeholder="Search"
            placeholderTextColor={'#9AA0A6'}
            value={searchValue}
            style={styles.textInputStyle}
          />
        </View>
        <FlatList
          data={workspacelist}
          contentContainerStyle={{paddingBottom: 20}}
          style={{paddingTop: 5, height: '75%'}}
          renderItem={({item, index}) => {
            let isSelected = selectedWorkspace.id === item.id;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  this.getBoardTables(item?.id);
                  this.setState({selectedWorkspace: item, showTables: true});
                  // console.log('Workspace selected', item);
                  //this.props.setWsId(item.id);
                  //this.displayWS.closeBottomDrawer();
                }}
                style={isSelected ? styles.frame5 : styles.frame6}>
                <RoomAvatar
                  showCircle={false}
                  boardIcon={item?.logo}
                  size={26}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.textStyle, {marginLeft: 10}]}>
                  {item?.name?.trim()}
                </Text>
                <Text></Text>
              </TouchableOpacity>
            );
          }}
          bounces={false}
        />
      </View>
    );
  }
  onClickTable() {
    if (this.state.selectedTable !== emptyArray) {
      let {selectedWorkspace, selectedTable} = this.state;
      // console.log('Selected table', this.state.selectedTable.name);
      // let workspace = this.state.selectedWorkspace;
      // let tableData = {
      //   name: this.state.selectedTable.name,
      //   id: this.state.selectedTable.id,
      // };
      //workspace.table = tableData;
      this.props.setTaskWorkspace(selectedWorkspace, selectedTable);
      this.setState({showTables: false});
      this.workspaceRef.closeBottomDrawer();
    }
  }
  renderTables() {
    let {selectedWorkspace, tables, selectedTable, searchValue} = this.state;
    return (
      <View style={styles.viewStyle2}>
        <View style={styles.mainView}>
          <TouchableOpacity
            style={{padding: 5, marginLeft: 14, marginRight: 5}}
            onPress={() => {
              this.setState({showTables: false, selectedTable: emptyArray});
            }}>
            <Icon
              name={'Left_Direction'}
              size={normalize(24)}
              color={'#202124'}
            />
          </TouchableOpacity>

          <RoomAvatar
            showCircle={false}
            boardIcon={selectedWorkspace?.logo}
            size={26}
          />
          <Text numberOfLines={1} style={styles.workspaceHeaderText}>
            {selectedWorkspace?.name?.trim()}
          </Text>
          <TouchableOpacity
            onPress={() => this.onClickTable()}
            style={styles.viewStyle1}>
            <Text
              style={[
                styles.textStyle,
                selectedTable !== emptyArray
                  ? {color: '#0D6EFD'}
                  : {color: '#9AA0A6'},
              ]}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
        {tables ? (
          <View style={{marginTop: 10, marginHorizontal: 20}}>
            <TextInput
              ref={input}
              onChangeText={(searchValue) => this.setState({searchValue})}
              placeholder="Search"
              placeholderTextColor={'#9AA0A6'}
              value={searchValue}
              style={styles.textInputStyle}
            />
          </View>
        ) : null}
        <FlatList
          data={tables}
          contentContainerStyle={{paddingBottom: 20}}
          ListEmptyComponent={() => {
            return (
              <View style={{alignItems: 'center', marginTop: 30}}>
                <Text style={styles.noDataText}>
                  No table in this workspace !!!
                </Text>
              </View>
            );
          }}
          style={{paddingTop: 5, height: '75%'}}
          renderItem={({item, index}) => {
            let isSelected = selectedTable.id === item.id;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  //this.getBoardTables(item?.id);
                  this.setState({selectedTable: item});
                  //this.props.setWsId(item.id);
                  //this.displayWS.closeBottomDrawer();
                }}
                style={isSelected ? styles.frame5 : styles.frame6}>
                {/* <RoomAvatar
                  showCircle={false}
                  boardIcon={item?.logo}
                  size={26}
                /> */}
                <Icon name={'Table'} size={normalize(24)} color={'#202124'} />
                <Text numberOfLines={1} style={styles.boardTitleText}>
                  {item?.name?.trim()}
                </Text>
                {isSelected ? (
                  <Icon
                    name={'SingleTick'}
                    size={normalize(24)}
                    color={'#0D6EFD'}
                  />
                ) : null}
                {/* {item?.tables?.map(() => {
                  return (
                    <View>
                      <Icon
                        name={'Table'}
                        size={normalize(24)}
                        color={'#202124'}
                      />
                      <Text>{item?.name}</Text>
                    </View>
                  );
                })} */}
              </TouchableOpacity>
            );
          }}
          bounces={false}
        />
      </View>
    );
  }

  render() {
    return (
      <BottomUpModalShare
        ref={(ref) => {
          this.workspaceRef = ref;
        }}
        height={450}>
        {this.state.showTables ? this.renderTables() : this.selectWorkspace()}
      </BottomUpModalShare>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    flex: 1,
    margin: 16,
    fontWeight: '500',
    fontSize: normalize(16),
    color: '#202124',
  },
  workspaceHeaderText: {
    flex: 1,
    margin: 16,
    marginLeft: 10,
    fontWeight: '500',
    fontSize: normalize(16),
    color: '#202124',
  },
  textStyle: {
    fontWeight: '500',
    fontSize: normalize(16),
  },
  noDataText: {
    fontWeight: '400',
    fontSize: normalize(16),
  },
  boardTitleText: {
    fontWeight: '400',
    fontSize: normalize(18),
    marginLeft: 10,
    flex: 1,
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
  viewStyle1: {padding: 10, marginRight: 10},
  viewStyle2: {marginBottom: 10},
});

export default SelectTaskWorkspace;
