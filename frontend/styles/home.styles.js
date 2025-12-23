import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  skip: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },

  skipText: {
    color: '#00bcd4',
    fontWeight: '600',
  },

  topCurve: {
    position: 'absolute',
    top: -width * 0.3,
    width: width,
    height: width,
    backgroundColor: '#f2f9fc',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },

  logoContainer: {
    position: 'absolute',
    top: 120,
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
  },

  logo: {
    width: 100,
    height: 100,
  },

  logoText: {
    marginTop: 8,
    fontSize: 30,
    letterSpacing: 2,
    color:  '#00bcd4',
    fontFamily: 'Versallis',
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 24,
    paddingTop: 300,
  },
   buttomCurve: {
  position: 'absolute',
  bottom: -width * 0.3,
  width: width,
  height: width,
  backgroundColor: '#f2f9fc',
  borderTopLeftRadius: width,
  borderTopRightRadius: width,
},

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00bcd4',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },

  dots: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cceef3',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#00bcd4',
  },

  button: {
    width: 200,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 40,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles;
