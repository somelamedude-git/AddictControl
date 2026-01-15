import { Text, View } from "react-native"
import Navbar from "../components/navbar"

const TestResults = ({navigation}:any) => {
    return (
        <View>
            <Text>Test Results</Text>
            <Navbar navigation={navigation}/>
        </View>
    )
}

export default TestResults