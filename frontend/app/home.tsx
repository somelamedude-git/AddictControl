import { View, Text, TouchableOpacity, StyleSheet, Dimensions,Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import styles from '@/styles/home.styles.js';


const { width } = Dimensions.get('window');

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Skip */}
      <TouchableOpacity style={styles.skip} onPress={() => router.replace('/profile')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

     
<View style={styles.topCurve} />
<View style={styles.logoContainer}>
    <Image
      source={require('../assets/images/santulan.png')}
      style={styles.logo}
      resizeMode="contain"
    />
    <Text style={styles.logoText}>SANTULAN</Text>
  </View>
 {/* show case theresult ofthe test herecode will me then will  show it*/ }

      <View style={styles.content}>
        <Text style={styles.title}>Remove Your{"\n"}Addiction with us</Text>

        <Text style={styles.subtitle}>
          get help and check your previous
          results on the profile page 
          and get in touch with your doctor for more help
        </Text>

        <TouchableOpacity onPress={() => router.push('/profile')}>
          <LinearGradient
            colors={['#00c9c8', '#00bcd4']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

