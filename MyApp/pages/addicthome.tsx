import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ImageBackground } from "react-native";
import axios from "axios";
import Logoutcomp from "../components/logout";
import { useAuthStore } from "../utils/state_utils/zust";
import NavbarAdd from "../components/navbaraddict";

const Quotes = [
	"Asking for help is really the beginning of any sort of recovery process",
	"Remember just because you hit bottom doesn’t mean you have to stay there",
	"All the suffering, stress, and addiction comes from not realizing you already are what you are looking for.",
	"Addiction is an adaptation. It’s not you–it’s the cage you live in.",
	"Don't pick up a drink or drug, one day at a time. It actually is simple, but it isn't easy: it requires incredible support and fastidious structiurng.",
	"First you take a drink, then the drink takes a drink, then the drink takes you",
	"Sobriety is a journey, not a destination",
	"Lighten up on yourself. No one is perfect. Gently accept your humanness",
];

const getRandom = (min: number, max: number) => {
	let random = Math.floor(Math.random() * (max - min + 1)) + min;
	return random;
}

const AddictHome = ({ navigation }: any) => {
	const [quote, setQuote] = useState('We appreciate you on taking a step forward!');
	const [limit, setLimit] = useState(10);
	const accessToken = useAuthStore((state: any) => state.accessToken);
	const [testResults, setTestResults] = useState<any[]>([]);

	useEffect(() => {
		const max: number = Quotes.length - 1;
		const min: number = 0;
		const random = getRandom(min, max);
		setQuote(Quotes[random]);
	}, []);

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await axios.get('http://localhost:5000/test/see_results', {
					params: {
						limit: limit
					},
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				});

				setTestResults(response.data.test_results);

			}
			catch (err) {
				console.log(err);
			}
		}

		if (accessToken) {
			loadData();
		}
	}, [limit, accessToken]);


	return (
		<ImageBackground
			source={require('../components/assets/images/bg.jpg')}
			style={styles.container}
		>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					<ScrollView contentContainerStyle={styles.scrollContent}>

						{/* Header Section */}
						<View style={styles.header}>
							<Text style={styles.headerTitle}>Welcome Home</Text>
							<Logoutcomp navigation={navigation} />
						</View>

						{/* Quote Card */}
						<View style={styles.quoteCard}>
							<Text style={styles.quoteTitle}>Daily Inspiration</Text>
							<Text style={styles.quoteText}>"{quote}"</Text>
						</View>

						{/* Recent Results Section */}
						<Text style={styles.sectionTitle}>Recent Progress</Text>
						<View style={styles.resultsContainer}>
							{testResults && testResults.length > 0 ? (
								testResults.map((test: any, index: number) => (
									<View key={index} style={styles.resultCard}>
										<View style={styles.scoreCircle}>
											<Text style={styles.scoreText}>{test.overall_score || 0}</Text>
										</View>
										<View style={styles.resultInfo}>
											<Text style={styles.resultLabel}>Overall Score</Text>
											<Text style={styles.subLabel}>Voice: {test.voice_score} • Logic: {test.logical_reasoning_score}</Text>
										</View>
									</View>
								))
							) : (
								<Text style={styles.emptyText}>No results available yet.</Text>
							)}
						</View>

						{/* Navigation Action */}
						<TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TestR')}>
							<Text style={styles.actionButtonText}>VIEW FULL TEST RESULTS</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[styles.actionButton, { marginTop: 15, backgroundColor: '#4A61AF' }]} onPress={() => navigation.navigate('TestPortal')}>
							<Text style={styles.actionButtonText}>TAKE NEW TEST</Text>
						</TouchableOpacity>

						{/* Spacer for Navbar */}
						<View style={{ height: 80 }} />

					</ScrollView>

					{/* Fixed Bottom Navbar */}
					<View style={styles.navbarContainer}>
						<NavbarAdd navigation={navigation} />
					</View>
				</View>
			</SafeAreaView>
		</ImageBackground >
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 30,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: '#2d3436',
	},
	quoteCard: {
		backgroundColor: 'rgba(255,255,255,0.85)',
		borderRadius: 20,
		padding: 25,
		marginBottom: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
		borderLeftWidth: 5,
		borderLeftColor: '#4A61AF',
	},
	quoteTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: '#4A61AF',
		marginBottom: 10,
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
	quoteText: {
		fontSize: 18,
		fontStyle: 'italic',
		color: '#2d3436',
		lineHeight: 26,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#2d3436',
		marginBottom: 15,
	},
	resultsContainer: {
		marginBottom: 30,
	},
	resultCard: {
		backgroundColor: 'rgba(255,255,255,0.9)',
		borderRadius: 16,
		padding: 15,
		marginBottom: 15,
		flexDirection: 'row',
		alignItems: 'center',
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 2,
	},
	scoreCircle: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#E8F1FC',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	scoreText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#4A61AF',
	},
	resultInfo: {
		flex: 1,
	},
	resultLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: '#2d3436',
		marginBottom: 4,
	},
	subLabel: {
		fontSize: 13,
		color: '#636e72',
	},
	emptyText: {
		color: '#636e72',
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 10,
	},
	actionButton: {
		backgroundColor: '#4A61AF',
		borderRadius: 15,
		paddingVertical: 18,
		alignItems: 'center',
		shadowColor: "#4A61AF",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	actionButtonText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '800',
		letterSpacing: 1.2,
	},
	navbarContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	}
});

export default AddictHome;
