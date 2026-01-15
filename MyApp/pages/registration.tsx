import { useState, useEffect } from "react";
import {View, TextInput, Alert, Text, Button} from "react-native";
import axios from "axios";
import validator from "validator";

export function RegistrationFamilyMember(){
	const [formData, setFormData] = useState<{
		email: string;
		password: string;
		phone: string;
		name: string;
		addict_email: string;}>
	({
		email: '',
		password: '',
		phone: '',
		name: '',
		addict_email: ''
	});

	const [error, setError] = useState<string>('');
	const [repassword, setRepassword] = useState<string>('');
	const [errorType, setErrorType] = useState<string>('');


	const handleInputChange = (name: string, value: any)=>{ // react native has no dom, a fun fact that truly isnt fun
		setFormData(prev=>({
			...prev,
			[name]: value
		}));
	};

	const register = async()=>{
		try{
			if(!validator.isEmail(formData.email)){
				setError('Please Enter a valid email address');
				setErrorType('selfMail');
				return;
			}

			if(!validator.isEmail(formData.addict_email)){
				setError('Connected member email not valid');
				setErrorType('coreMail'); 
				return;
			}

			if(repassword != formData.password){
				setError('Password does not match');
				setErrorType('passwordMismatch');
				return;
			}

			setError('');
			setErrorType('');

			if(formData.email && formData.addict_email && formData.name && formData.password && formData.phone){
				const response = await axios.post("/register/api", {
					member_email: formData.email,
					addict_email: formData.addict_email,
					password: formData.password,
					member_phone_number: formData.phone,
					name: formData.name
				}); // use apiClient once made, payload will be going from here

				if(response.data.success){
					// put an alert or a modal over here
				}
			}
			else{
				// throw an alert or a react toaster here, figure it out during the ui - note to self.
			}
		}
		catch(err){
			console.log(err);
			// here also, add some ui
		}
	}

	// This comment is also not written by ai ---irritated face emoji x2
	
	return(
		<View>
			<View>
				<TextInput
					placeholder="email"
					onChangeText = {value=>handleInputChange("email", value)}
					keyboardType="email-address"
					autoCapitalize="none"
					value= {formData.email}
				/>

				{errorType==="selfMail" && (
					<Text>{error}</Text>
				)}

				<TextInput
					placeholder="phone"
					onChangeText = {value=>handleInputChange("phone", value)}
					value={formData.phone}
					keyboardType="numeric"
				/>
			</View>
			<View>
				<TextInput
					placeholder="name"
					onChangeText = {value=>handleInputChange("name",value)}
					value={formData.name}
				/>

				<TextInput
					placeholder="addict_email"
					onChangeText={value=>handleInputChange("addict_email", value)}
					value={formData.addict_email}
				/>
				{errorType==="coreMail" && (
					<Text>{error}</Text>
				)}

			</View>
			<View>
				<TextInput
					placeholder="password"
					onChangeText={value=>handleInputChange("password", value)}
					value={formData.password}
					secureTextEntry={true}
				/>

				<TextInput
					placeholder="re-enter password"
					onChangeText={value=>setRepassword(value)}
					value={repassword}
					secureTextEntry={true}
				/>
				{errorType==="passwordMismatch" && (
					<Text>{error}</Text>
				)}
			</View>

			<View>
				<Button
					title="Register User"
					onPress = {register}
				/>
			</View>
		</View>
	);
}

export function RegistrationAddict(){
	const [formData, setFormData] = useState<{
		phone: string;
		email: string;
		password: string;
		name: string;
		age: string;
	}>({
		phone: '',
		email: '',
		password: '',
		name: '',
		age: '' // will keep age as a string, will parse in backend
	});

	const [error, setError] = useState<string>('');
	const [repassword, setRepassword] = useState<string>('');
	const [errorType, setErrorType] = useState<string>('');

	const handleInputChange = (name: string, value: any)=>{ 
		setFormData(prev=>({
			...prev,
			[name]: value
		}));
	};

	const register = async()=>{
		try{
			if(!validator.isEmail(formData.email)){
				setError('Please enter a valid email');
				setErrorType('invalidEmail');
				return;
			}

			if(Number(formData.age)<18){
				setError('Age below limit');
				setErrorType('ageLimit');
				return;
			}

			if(repassword != formData.password){
				setError('Passwords do not match');
				setErrorType('mismatchPassword');
				return;
			}

			if(formData.phone && formData.age && formData.email && formData.password){
				const response = await axios.post("/api/registerAddict", {
					phone: formData.phone,
					email: formData.email,
					password: formData.password,
					name: formData.name,
					age: formData.age
				});

				if(response.data.success){
					// send a success modal over here
				}
		}
			else{
					// throw in a react toaster
			}
	} catch(err){
		console.log(err);
	}
}
	return(
		<View>
			<View>
				<TextInput
					placeholder="phone"
					onChangeText = {value=>handleInputChange("phone", value)}
					value={formData.phone}
					keyboardType="numeric"
				/>
				<TextInput
					placeholder="name"
					onChangeText = {value=>handleInputChange("name",value)}
					value={formData.name}
				/>
			</View>
			<View>	
				<TextInput
					placeholder="email"
					onChangeText={value=>handleInputChange("email", value)}
					value={formData.email}
					keyboardType="email-address"
					autoCapitalize="none"
				/>
				{errorType==="invalidEmail" && (
					<Text>{error}</Text>
				)}
				<TextInput
					placeholder="age"
					onChangeText={value=>handleInputChange("age", value)}
					value={formData.age}
					keyboardType="numeric"
				/>
				{errorType==="ageLimit" && (
					<Text>{error}</Text>
				)}
			</View>
			<View>
				<TextInput
					placeholder="password"
					onChangeText={value=>handleInputChange("password", value)}
					value={formData.password}
					secureTextEntry={true}
				/>
				<TextInput
					placeholder="re-enter password"
					onChangeText={value=>setRepassword(value)}
					value={repassword}
					secureTextEntry={true}
				/>
				{errorType==="mismatchPassword" && (
					<Text>{error}</Text>
				)}
			</View>

			<View>
				<Button
					title="Register Addict"
					onPress = {register}
				/>
			</View>
		</View>
	);
}