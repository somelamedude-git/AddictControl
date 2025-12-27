import { StyleSheet} from 'react-native';
import COLORS from '@/constants/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    marginBottom: 10,
  },

  profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  hi: {
    fontSize: 12,
    color: '#888',
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },

  sectionTitle: {
    fontWeight: '600',
    color: '#00bcd4',
  },

  seeAll: {
    color: '#00bcd4',
    fontSize: 12,
  },

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },

  categoryItem: {
    alignItems: 'center',
  },

  categoryText: {
    marginTop: 6,
    fontSize: 12,
  },

  scheduleCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  scheduleTitle: {
    color: '#fff',
    fontWeight: '600',
  },

  month: {
    color: '#fff',
    fontSize: 12,
  },

  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },

  day: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  activeDay: {
    backgroundColor: '#fff',
  },

  dayNumber: {
    color: '#fff',
    fontWeight: '600',
  },

  dayText: {
    fontSize: 10,
    color: '#fff',
  },

  activeText: {
    color: '#00bcd4',
  },

  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  scheduleInfo: {
    color: '#fff',
    fontSize: 12,
  },

  seeAllWhite: {
    color: '#fff',
    fontSize: 12,
  },

  scoreCard: {
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row' ,
    marginBottom: 16,
  },

  moodCard: {
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },

  moodText: {
    color: '#fff',
    fontWeight: '600',
  },
  monthGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 10,
},

monthDay: {
  width: '14.28%', 
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  backgroundColor: 'rgba(255,255,255,0.2)', 
  marginBottom: 8,
},

monthToday: {
  backgroundColor: '#fff',
},

monthDrunk: {
  backgroundColor: '#ff4d4d',
},

monthText: {
  fontSize: 12,
  fontWeight: '600',
  color: '#fff',
},
header: {
  paddingTop: 60,
  paddingBottom: 30,
  alignItems: "center",
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},

avatar: {
  width: 90,
  height: 90,
  borderRadius: 45,
  marginBottom: 10,
},

name: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#fff",
},

email: {
  fontSize: 14,
  color: "#e0f7fa",
},

card: {
  marginBlockStart:15,
  margin: 3,
  padding: 16,
  borderRadius: 16,
  elevation: 4,
},

cardRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},

cardText: {
  marginLeft: 10,
  fontSize: 15,
  color:COLORS.white,
},

logoutBtn: {
  margin: 20,
  backgroundColor: "#ff5252",
  padding: 14,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

logoutText: {
  color: "#fff",
  fontWeight: "bold",
  marginLeft: 8,
},


});
export default styles;

