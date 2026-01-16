import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Dimensions, ImageBackground } from "react-native";
import Requesttest from "../components/requesttest";
import Logoutcomp from "../components/logout";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import axios from "axios";
import { useAuthStore } from "../utils/state_utils/zust";

const FamHome = ({ navigation }: any) => {
    const [formData, setformdata] = useState({
        name: 'Loading...',
        email: '...',
        phone: '...',
        sobriety: 0,
        age: 0
    });

    const accessToken = useAuthStore((state: any) => state.accessToken);

    useEffect(() => {
        const addictdata = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:5000/users/addictdata',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                setformdata(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        if (accessToken) {
            addictdata();
        }
    }, [accessToken])

    return (
        <ImageBackground
            source={require('../components/assets/images/bg.jpg')}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>

                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.greeting}>Hello,</Text>
                                <Text style={styles.headerTitle}>Family Guardian</Text>
                            </View>
                            <Logoutcomp navigation={navigation} />
                        </View>

                        {/* Main Action Card */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Addict Profile</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>Active</Text>
                                </View>
                            </View>

                            <View style={styles.profileRow}>
                                <View style={styles.profileItem}>
                                    <Text style={styles.label}>Name</Text>
                                    <Text style={styles.value}>{formData.name}</Text>
                                </View>
                                <View style={styles.profileItem}>
                                    <Text style={styles.label}>Age</Text>
                                    <Text style={styles.value}>{formData.age}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.profileRow}>
                                <View style={styles.profileItem}>
                                    <Text style={styles.label}>Sobriety Streak</Text>
                                    <Text style={styles.highlightValue}>{formData.sobriety} Days</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.profileRow}>
                                <View style={styles.profileItem}>
                                    <Text style={styles.label}>Contact</Text>
                                    <Text style={styles.value}>{formData.email}</Text>
                                    <Text style={styles.subValue}>{formData.phone}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Actions Grid */}
                        <Text style={styles.sectionTitle}>Actions</Text>
                        <View style={styles.actionsContainer}>
                            {/* Placeholder for Requesttest component styling - usually we'd pass styles to it or wrap it */}
                            <View style={styles.actionWrapper}>
                                <Requesttest />
                            </View>

                            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('TestR')}>
                                <Text style={styles.secondaryButtonText}>VIEW TEST RESULTS</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Spacer for Navbar */}
                        <View style={{ height: 80 }} />

                    </ScrollView>

                    <View style={styles.navBarWrapper}>
                        <Navbar navigation={navigation} />
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    greeting: {
        fontSize: 14,
        color: '#636e72',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#2d3436',
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 24,
        padding: 25,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2d3436',
    },
    statusBadge: {
        backgroundColor: '#e6fffa',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        color: '#4A61AF',
        fontSize: 12,
        fontWeight: '700',
    },
    profileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    profileItem: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#b2bec3',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#2d3436',
        fontWeight: '600',
    },
    subValue: {
        fontSize: 14,
        color: '#636e72',
        marginTop: 2,
    },
    highlightValue: {
        fontSize: 24,
        color: '#4A61AF',
        fontWeight: '800',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f2f6',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 15,
    },
    actionsContainer: {
        gap: 15,
    },
    actionWrapper: {
        marginBottom: 10,
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderWidth: 2,
        borderColor: '#4A61AF',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#4A61AF',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    navBarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    }
});

export default FamHome;