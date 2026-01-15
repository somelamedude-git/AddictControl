import { TouchableOpacity, View, Text } from "react-native"

const Navbar = ({navigation}:any) => {
    return(
        <View>
            <TouchableOpacity onPress={()=>navigation.replace('FamH')}>
                <Text>
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text onPress={() => navigation.replace('TestR')}>
                    Tests
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Navbar