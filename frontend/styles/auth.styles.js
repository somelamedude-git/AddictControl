import { StyleSheet,Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#00c9c8',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  content: {
    padding: 20,
  },

  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00bcd4',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },

  input: {
    backgroundColor: '#eaf7fb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf7fb',
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },

  forgot: {
    alignItems: 'flex-end',
    marginTop: 8,
  },

  forgotText: {
    color: '#00bcd4',
    fontSize: 12,
  },

  loginButton: {
    marginTop: 20,
    backgroundColor: '#00c9c8',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#aaa',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },

  signup: {
    textAlign: 'center',
    color: '#777',
  },

  signupLink: {
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
  buttomCurve: {
  position: 'absolute',
  bottom: -width * 0.3,
  width: width,
  height: width,
  backgroundColor: '#f2f9fc',
  borderTopLeftRadius: width,
  borderTopRightRadius: width,
},

   rightCurve: {
    position: 'absolute',
    top: -width * 0.3,
    width: width,
    height: width,
    backgroundColor: '#f2f9fc',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },
   leftCurve: {
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
  zIndex: 5, },

logo: {
  width: 110,
  height: 110,
},

logoText: {
  marginTop: 8,
  fontSize: 28,
  letterSpacing: 3,
  color: '#023047',
  fontFamily: 'Versallis',
},

});
export default styles;