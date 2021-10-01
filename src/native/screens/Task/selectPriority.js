import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Icon} from '../../components/Icon/Icon.js';
import {getTimeline, normalize} from '../../utils/helpers';
import {BottomUpModal} from '../../components/BottomUpModal';
import {emptyArray} from '../../../shared/redux/constants/common.constants';

const data = [
  {
    title: 'High',
    color: '#D9435F',
  },
  {
    title: 'Medium',
    color: '#2B75E4',
  },
  {
    title: 'Low',
    color: '#04B462',
  },
];
class SelectPriority extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priority: '',
    };
  }

  openModal(priority) {
    this.setState({priority});
    this.priorityRef.openBottomDrawer();
  }

  selectPriority() {
    const {priority} = this.state;
    return (
      <View style={{marginBottom: 10}}>
        <View style={styles.mainView}>
          <Text style={styles.headerText}>Select Priority</Text>
        </View>
        {data.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.setState({priority: item});
                this.props.setPriority(item);
                this.priorityRef.closeBottomDrawer();
              }}
              style={[styles.viewStyle, {backgroundColor: item?.color}]}>
              <Text
                style={[
                  styles.textStyle,
                  {color: '#ffffff', paddingHorizontal: 12},
                ]}>
                {item?.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  render() {
    return (
      <BottomUpModal
        ref={(ref) => {
          this.priorityRef = ref;
        }}
        height={450}>
        {this.selectPriority()}
      </BottomUpModal>
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
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E4E5E7',
  },
  viewStyle: {
    margin: 20,
    marginBottom: 0,
    borderRadius: 24,
    padding: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

export default SelectPriority;
