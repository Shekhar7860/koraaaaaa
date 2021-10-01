import React from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Icon} from '../../components/Icon/Icon.js';
import {getTimeline, normalize} from '../../utils/helpers';
import {BottomUpModal} from '../../components/BottomUpModal';
import {emptyArray} from '../../../shared/redux/constants/common.constants';
import {BottomUpModalShare} from '../../components/BottomUpModal/BottomUpModalShare.js';
import {CalendarList} from 'react-native-calendars';
var deviceWidth = Dimensions.get('window').width;

class SelectDueDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dueDate: new Date(),
      dueTime: '',
      markedDates: {},
      showCalendar: true,
    };
  }

  openModal(dueDate) {
    //this.setState({dueDate});
    this.dueDateRef.openBottomDrawer();
  }
  getSelectedDayEvents(date) {
    const todaysDate = new Date().getDate();
    const selectedDate = new Date(date).getDate();
    let selectedColor, selectedTextColor;
    selectedColor = selectedTextColor = '';
    if (todaysDate === selectedDate) {
      selectedColor = '#202124';
      selectedTextColor = '#ffffff';
    } else {
      selectedColor = '#EFF0F1';
      selectedTextColor = '#202124';
    }
    let markedDates = {};
    markedDates[date] = {
      selected: true,
      disableTouchEvent: true,
      selectedColor,
      selectedTextColor,
    };
    let serviceDate = new Date(date);
    //serviceDate = serviceDate.format('DD.MM.YYYY');
    //this.props.dateSelected(serviceDate, markedDates);
    this.setState({
      dueDate: serviceDate,
      markedDates: markedDates,
    });
  }

  renderCalendar() {
    return (
      <CalendarList
        horizontal={true}
        pagingEnabled={true}
        style={styles.calendar}
        calendarWidth={deviceWidth}
        calendarHeight={300}
        showSixWeeks={true}
        hideExtraDays={false}
        //showWeekNumbers={true}
        markedDates={this.state.markedDates}
        //firstDay={1}
        disableAllTouchEventsForDisabledDays={true}
        current={this.state.dueDate || new Date()}
        disabled
        theme={{
          textDayFontSize: normalize(16),
          textDisabledColor: '#9AA0A6',
          textDayFontWeight: '400',
          textMonthFontSize: normalize(16),
          textMonthFontWeight: '700',
          monthTextColor: '#202124',
          dayTextColor: '#202124',
          borderColor: 'red',
          todayTextColor: '#ffffff',
          todayBackgroundColor: '#202124',
          'stylesheet.calendar.header': {
            header: {
              fontWeight: '600',
              //height: 0,
              //opacity: 0,
            },
            dayHeader: {
              color: '#202124',
              fontSize: normalize(16),
              // fontFamily: Constants.fontFamily,
              paddingRight: 5,
              paddingBottom: 5,
            },
          },
        }}
        onDayPress={(day) => {
          this.getSelectedDayEvents(day.dateString);
          this.setState({showCalendar: false});
        }}
        onVisibleMonthsChange={(months) => {
          //let date = new Date(months[0].dateString);
          //let monthAndYear = getTimeline(date, 'fullMonthAndYear');
          //this.props.onMonthChange(monthAndYear);
        }}
      />
    );
  }
  renderTime() {
    var x = 15; //minutes interval
    var times = []; // time array
    var tt = 480; // start time
    var ap = ['am', 'pm']; // AM-PM
    times[0] = 'None';
    //loop to increment the time and push results in array
    for (var i = 1; tt < 24 * 50.5; i++) {
      var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      var mm = tt % 60; // getting minutes of the hour in 0-55 format
      times[i] =
        ('0' + (hh % 12)).slice(-2) +
        ':' +
        ('0' + mm).slice(-2) +
        ' ' +
        ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
    }
    //console.log(times);
    return (
      <View style={{marginVertical: 10}}>
        <Text style={[styles.textStyle, {paddingLeft: 25}]}>Set Due Time</Text>
        <ScrollView style={{marginTop: 15, height: '65%'}}>
          {times.map((item, key) => (
            <TouchableOpacity
              onPress={() => this.setState({dueTime: item})}
              style={{
                padding: 15,
                paddingLeft: 25,
                backgroundColor:
                  this.state.dueTime === item ? '#F3F8FF' : '#ffffff',
              }}>
              <Text
                key={key}
                style={{fontWeight: '500', fontSize: normalize(18)}}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  selectDueDate() {
    const {dueDate, dueTime} = this.state;
    return (
      <View style={{marginBottom: 10}}>
        <View style={styles.mainView}>
          <Text style={styles.headerText}>Select Due Date</Text>
          <TouchableOpacity
            onPress={() => {
              let dateTime = {
                date: dueDate,
                time: dueTime,
              };
              this.props.setDueDate(dateTime);
              this.dueDateRef.closeBottomDrawer();
            }}
            style={styles.viewStyle1}>
            <Text style={[styles.textStyle, {color: '#0D6EFD'}]}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{margin: 25, marginTop: 12, marginBottom: 10}}>
          <Text style={styles.textStyle}>Due date</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: '#0D6EFD',
              paddingHorizontal: 12,
              paddingVertical: 5,
            }}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              {this.state.dueDate ? (
                <TouchableOpacity
                  onPress={() => this.setState({showCalendar: true})}
                  style={styles.viewStyle2}>
                  <Text style={styles.dateTextStyle}>
                    {getTimeline(this.state.dueDate, 'numberDate')}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.state.dueTime ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.dateTextStyle, {paddingHorizontal: 10}]}>
                    at
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({showCalendar: false})}
                    style={styles.viewStyle2}>
                    <Text style={styles.dateTextStyle}>
                      {this.state.dueTime}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() =>
                this.setState({dueDate: '', dueTime: '', showCalendar: true})
              }
              style={{padding: 6}}>
              <Icon name={'cross'} size={normalize(24)} color={'#202124'} />
            </TouchableOpacity>
          </View>
        </View>

        {this.state.showCalendar ? this.renderCalendar() : this.renderTime()}
      </View>
    );
  }

  render() {
    return (
      <BottomUpModalShare
        ref={(ref) => {
          this.dueDateRef = ref;
        }}
        height={570}>
        {this.selectDueDate()}
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
  viewStyle1: {padding: 10, marginRight: 10},
  calendar: {
    width: deviceWidth,
    paddingTop: 10,
  },
  viewStyle2: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#EFF0F1',
  },
  dateTextStyle: {
    fontWeight: '400',
    fontSize: normalize(16),
  },
});

export default SelectDueDate;
