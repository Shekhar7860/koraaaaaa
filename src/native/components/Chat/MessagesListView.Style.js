import * as Constants from '../KoraText';
import {StyleSheet} from 'react-native';
import {normalize} from '../../utils/helpers';

export default StyleSheet.create({
  inputContainerStyle: {
    backgroundColor: 'white',
    height: 36,
    paddingLeft: 0,
  },
  searchFooter1: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderColor: '#E4E5E7',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchFooter2: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  searchFooter3: {paddingHorizontal: 5},
  searchFooter4: {paddingHorizontal: 5},
  bottomUpModal1: {
    padding: 10,
    margin: 4,
    borderRadius: 5,
  },
  bottomUpModal2: {flexDirection: 'row', alignItems: 'center'},
  bottomUpModal4: {padding: 5},
  bottomUpModal5: {
    fontSize: normalize(18),
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#DD3646',
  },
  bottomUpModal6:{
    height: 1,
    backgroundColor: '#EFF0F1',
  },
  modalOption1: {
    /* marginHorizontal: 4,
    margin: 4,
    padding: 23,
    paddingVertical: 10,
    borderRadius: 5, */
    marginStart: 15,
    marginEnd: 15,
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
  },
  modalOption2: {flexDirection: 'row', alignItems: 'center'},
  modalOption3: {marginRight: 10},
  modalTextStyle1: {
    fontWeight: '500',
    fontSize: normalize(18),
    fontStyle: 'normal',
    fontFamily: Constants.fontFamily,
    color: '#DD3646',
  },

  bottomUpModal3: {
    //backgroundColor: 'red',
    // flex: 1,
    // height: 20,
    // display: 'flex',
    margin: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  traceInfo1: {
    flexDirection: 'row',
    padding: 7,
    marginHorizontal: 15,
    marginVertical: 3,
  },
  traceInfo2: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 7,
    flex: 1,
  },
  traceInfo3: {flexDirection: 'row'},
  traceInfo4: {
    flexDirection: 'row',
  },
  traceInfo5: {
    textAlign: 'left',
    color: '#605E5C',
    marginRight: 2,
  },
  traceInfo6: {
    textAlign: 'left',
    color: '#605E5C',
    marginLeft: 2,
  },
  traceInfo7: {
    justifyContent: 'center',
  },
  traceInfo8: {textAlign: 'center', color: '#989FA5', fontSize: normalize(15)},
  traceInfo9: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 11,
    borderBottomWidth: 0.4,
    borderColor: '#9AA0A6',
    flexDirection: 'row',
  },
  traceInfo10: {width: '90%'},
  replyComponent1: {
    flexDirection: 'row',
    margin: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#bdc1c6',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    borderRadius: 4,
    maxWidth: '100%',
  },
  replyComponent2: {flexDirection: 'column'},
  replyComponent3: {paddingHorizontal: 12, paddingTop: 10, paddingBottom: 5},
  replyComponent4: {paddingHorizontal: 12, paddingBottom: 10, paddingTop: 5},
  replyComponent5: {flex: 1},
  replyComponent6: {width: 80, height: 80, paddingTop: 10},
  replyComponent7: {
    padding: 3,
    margin: 3,
    marginRight: 15,
    borderRadius: 4,
    backgroundColor: '#F8F9FA',
  },
  replyComponent8: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  replyComponent9: {width: '90%'},
  replyComponent10: {backgroundColor: '#F8F9FA'},
  emojiStyle1: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  emojiStyle2: {flexDirection: 'row', justifyContent: 'space-around'},
  emojiStyle3: {
    padding: 12,
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  emojiStyle4: {flexDirection: 'row', padding: 10},
  emojiStyle5: {flexDirection: 'row', padding: 7},
  emojiStyle6: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 7,
  },
  mainStyle1: {flex: 1},
  mainStyleReply: {flex: 1, justifyContent: 'flex-end'},
  mainStyle2: {flex: 1},
  listFooter1: {
    minHeight: 40,
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  listFooter2: {
    color: '#202124',
    alignItems: 'center',
    flexShrink: 1,
  },
  listFooter3: {
    fontSize: normalize(14),
    marginBottom: 2,
    textAlign: 'center',
  },
  listFooter4: {flex: 0},
  listFooter5: {fontSize: normalize(12)},
  listFooter6: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  dateChangeTimeLine1: {flexDirection: 'column'},
  dateChangeTimeLine2: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginTop: 5,
  },
  searchHeaderLocal1: {paddingLeft: 0, width: '80%'},
  searchHeaderLocal2: {backgroundColor: 'white'},
  separatorComponent1:{height: 5},
});
