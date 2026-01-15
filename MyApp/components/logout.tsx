import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../utils/state_utils/zust";
import axios from "axios";

const Logoutcomp = ({ navigation, ip }: any) => {
  const accessToken = useAuthStore((state: any) => state.accessToken);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `http://]localhost:5000/logout`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Logout response:", response.data);
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      await AsyncStorage.multiRemove(['refreshToken', 'accessToken', 'role']);
      useAuthStore.setState({ accessToken: null });
      navigation.replace('Login'); 
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
};

export default Logoutcomp;
