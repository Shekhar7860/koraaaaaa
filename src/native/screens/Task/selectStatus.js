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
    title: 'Open',
    color: '#FABE0A',
  },
  {
    title: 'In Progress',
    color: '#784BD1',
  },
  {
    title: 'Completed',
    color: '#04B462',
  },
];
class SelectStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
    };
  }

  openModal(status) {
    this.setState({status});
    this.statusRef.openBottomDrawer();
  }

  SelectStatus() {
    return (
      <View style={{marginBottom: 10}}>
        <View style={styles.mainView}>
          <Text style={styles.headerText}>Select Status</Text>
        </View>
        {data.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => {
                this.setState({status: item});
                this.props.setStatus(item);
                this.statusRef.closeBottomDrawer();
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
          this.statusRef = ref;
        }}
        height={450}>
        {this.SelectStatus()}
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

export default SelectStatus;
