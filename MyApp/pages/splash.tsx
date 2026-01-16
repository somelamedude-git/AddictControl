import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const checkLogin = async () => {
            // Minimum wait time for splash effect
            const minWait = new Promise(resolve => setTimeout(resolve, 2500));

            // Check auth state
            const authCheck = async () => {
                try {
                    const role = await AsyncStorage.getItem('role');
                    return role;
                } catch (e) {
                    return null;
                }
            };

            const [_, role] = await Promise.all([minWait, authCheck()]);

            if (role?.toLowerCase() === 'addict') {
                navigation.replace('AddictH');
            } else if (role?.toLowerCase() === 'family') {
                navigation.replace('FamH');
            } else {
                navigation.replace('Login');
            }
        };

        checkLogin();
    }, []);

    return (
        <ImageBackground
            source={require('../components/assets/images/SANTULAN.png')}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>SANTULAN</Text>
                <Text style={styles.subtitle}>Digital Wellness</Text>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '800',
        color: '#4A61AF',
        marginBottom: 10,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#636e72',
        fontWeight: '600',
        letterSpacing: 4,
    }
});

export default SplashScreen;
