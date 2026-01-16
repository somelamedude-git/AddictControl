import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, ImageBackground, Alert } from "react-native";
import axios from "axios";
import validator from "validator";

const RegistrationPage = ({ navigation }: any) => {
	const [role, setRole] = useState<'family' | 'addict'>('family');
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: '',
		addictEmail: '', // for family
		age: '' // for addict
	});

	const [error, setError] = useState<string>('');

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		setError('');
	};

	const handleRegister = async () => {
		try {
			// Common Validation
			if (!validator.isEmail(formData.email)) {
				setError('Please enter a valid email address');
				return;
			}
			if (formData.password !== formData.confirmPassword) {
				setError('Passwords do not match');
				return;
			}
			if (!formData.name || !formData.phone || !formData.password) {
				setError('Please fill in all required fields');
				return;
			}

			if (role === 'family') {
				// Family Registration
				if (!validator.isEmail(formData.addictEmail)) {
					setError('Connected member email is not valid');
					return;
				}

				const response = await axios.post("http://localhost:5000/register/api", {
					member_email: formData.email,
					addict_email: formData.addictEmail,
					password: formData.password,
					member_phone_number: formData.phone,
					name: formData.name
				});

				if (response.data.success) {
					Alert.alert("Success", "Family member registered successfully");
					navigation.navigate('Login');
				} else {
					Alert.alert("Error", "Registration failed");
				}

			} else {
				// Addict Registration
				if (!formData.age || Number(formData.age) < 18) {
					setError('Age must be 18 or older');
					return;
				}

				const response = await axios.post("http://localhost:5000/api/registerAddict", {
					phone: formData.phone,
					email: formData.email,
					password: formData.password,
					name: formData.name,
					age: formData.age
				});

				if (response.data.success) {
					Alert.alert("Success", "Addict registered successfully");
					navigation.navigate('Login');
				} else {
					Alert.alert("Error", "Registration failed");
				}
			}
		} catch (err: any) {
			console.log("Registration Error:", err);
			Alert.alert("Error", "Something went wrong during registration");
		}
	};

	return (
		<ImageBackground
			source={require('../components/assets/images/bg.jpg')}
			style={styles.container}
		>
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
					<ScrollView contentContainerStyle={styles.scrollContent}>

						<View style={styles.headerContainer}>
							<Text style={styles.headerTitle}>Create Account</Text>
							<Text style={styles.headerSubtitle}>Join us to start your journey</Text>
						</View>

						{/* Role Switcher */}
						<View style={styles.roleContainer}>
							<TouchableOpacity
								style={[styles.roleButton, role === 'family' && styles.activeRole]}
								onPress={() => setRole('family')}
							>
								<Text style={[styles.roleText, role === 'family' && styles.activeRoleText]}>Family Member</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.roleButton, role === 'addict' && styles.activeRole]}
								onPress={() => setRole('addict')}
							>
								<Text style={[styles.roleText, role === 'addict' && styles.activeRoleText]}>Addict Profile</Text>
							</TouchableOpacity>
						</View>

						{/* Form Fields */}
						<View style={styles.formCard}>

							{error ? <Text style={styles.errorText}>{error}</Text> : null}

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Full Name</Text>
								<TextInput
									style={styles.input}
									placeholder="John Doe"
									placeholderTextColor="#ccc"
									value={formData.name}
									onChangeText={(t) => handleChange('name', t)}
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Email Address</Text>
								<TextInput
									style={styles.input}
									placeholder="john@example.com"
									placeholderTextColor="#ccc"
									keyboardType="email-address"
									autoCapitalize="none"
									value={formData.email}
									onChangeText={(t) => handleChange('email', t)}
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Phone Number</Text>
								<TextInput
									style={styles.input}
									placeholder="1234567890"
									placeholderTextColor="#ccc"
									keyboardType="numeric"
									value={formData.phone}
									onChangeText={(t) => handleChange('phone', t)}
								/>
							</View>

							{role === 'family' ? (
								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Addict's Email (to link)</Text>
									<TextInput
										style={styles.input}
										placeholder="addict@example.com"
										placeholderTextColor="#ccc"
										keyboardType="email-address"
										autoCapitalize="none"
										value={formData.addictEmail}
										onChangeText={(t) => handleChange('addictEmail', t)}
									/>
								</View>
							) : (
								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Age</Text>
									<TextInput
										style={styles.input}
										placeholder="25"
										placeholderTextColor="#ccc"
										keyboardType="numeric"
										value={formData.age}
										onChangeText={(t) => handleChange('age', t)}
									/>
								</View>
							)}

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Password</Text>
								<TextInput
									style={styles.input}
									placeholder="••••••••••"
									placeholderTextColor="#ccc"
									secureTextEntry
									value={formData.password}
									onChangeText={(t) => handleChange('password', t)}
								/>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Confirm Password</Text>
								<TextInput
									style={styles.input}
									placeholder="••••••••••"
									placeholderTextColor="#ccc"
									secureTextEntry
									value={formData.confirmPassword}
									onChangeText={(t) => handleChange('confirmPassword', t)}
								/>
							</View>

							<TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
								<Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
								<Text style={styles.backButtonText}>← Back to Login</Text>
							</TouchableOpacity>

						</View>

					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 50,
	},
	headerContainer: {
		marginLeft: 20,
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: '800',
		color: '#2d3436',
		marginBottom: 5,
	},
	headerSubtitle: {
		fontSize: 16,
		color: '#636e72',
	},
	roleContainer: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,0.6)',
		borderRadius: 12,
		padding: 4,
		marginBottom: 25,
	},
	roleButton: {
		flex: 1,
		paddingVertical: 10,
		alignItems: 'center',
		borderRadius: 10,
	},
	activeRole: {
		backgroundColor: '#fff',
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	roleText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#636e72',
	},
	activeRoleText: {
		color: '#2d3436',
		fontWeight: '700',
	},
	formCard: {
		backgroundColor: 'rgba(255,255,255,0.95)',
		borderRadius: 20,
		padding: 25,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 3,
	},
	inputContainer: {
		marginBottom: 15,
		backgroundColor: '#f9f9f9',
		borderRadius: 15,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: '#eee',
	},
	inputLabel: {
		fontSize: 12,
		color: '#636e72',
		fontWeight: '600',
		marginBottom: 2,
	},
	input: {
		fontSize: 16,
		color: '#2d3436',
		padding: 0,
		height: 24,
	},
	registerButton: {
		backgroundColor: '#4A61AF',
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: 'center',
		marginTop: 10,
		shadowColor: "#4A61AF",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
		marginBottom: 15,
	},
	registerButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '800',
		letterSpacing: 1,
	},
	backButton: {
		alignItems: 'center',
		paddingVertical: 10,
	},
	backButtonText: {
		color: '#4A61AF',
		fontSize: 14,
		fontWeight: '600',
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
		textAlign: 'center'
	}
});

export default RegistrationPage;