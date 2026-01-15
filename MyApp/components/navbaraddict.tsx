import { TouchableOpacity, View, Text } from "react-native"

const NavbarAdd = ({navigation}:any) => {
    return(
        <View>
            <TouchableOpacity onPress={()=>navigation.replace('AddictH')}>
                <Text>
                    Home
                </Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>
                    Tests
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.replace('ProfileA')}>
                <Text>
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default NavbarAdd