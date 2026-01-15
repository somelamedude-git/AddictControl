import { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
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

const getRandom = (min:number, max:number)=>{
	let random = Math.floor(Math.random()*(max-min+1))+min;
	return random;
}

const AddictHome = ({navigation}:any)=>{
	const [quote, setQuote] = useState('We appreciate you on taking a step forward!');
	const [limit, setLimit] = useState(10);
	const accessToken = useAuthStore((state: any) => state.accessToken);
	
	useEffect(()=>{
		const max:number = Quotes.length;
		const min: number = 0;

		const random = getRandom(min, max);

		setQuote(Quotes[random]);
	}, []);

	const [testResults, setTestResults] = useState([]);

	useEffect(()=>{
		const loadData = async()=>{
			try{
				const response = await axios.get('http://localhost:5000/test/see_results', {
					params:{
						limit: limit
					},
					headers:{
						Authorization: `Bearer ${accessToken}`
					}
				});

				setTestResults(response.data.test_results);

			} 
			catch(err){
				console.log(err); // add some ui there
				// lead to login page here
			}
		}

		loadData();
	}, [limit, accessToken]);

	return (
		<View>
			<View>
				<Text>{quote}</Text>
			</View>
			<Logoutcomp navigation={navigation}/>
			
			<View>
				{
					testResults.map((test:any)=>(
						<View>
							<Text>{test.attempted?"Done":"Not Done"}</Text>
							<Text>{test.overall_score}</Text>
							<Text>{test.logical_reasoning_score}</Text>
							<Text>{test.voice_score}</Text>
						</View>
					))
				}
			</View>

			<NavbarAdd navigation={navigation}/>
		</View>
	)

}

export default AddictHome;
