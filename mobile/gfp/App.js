import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/pages/Login";
import MenuDrawer from "./src/pages/MenuDrawer";
import CadContas from "./src/pages/CadContas";
import { corSecundaria } from "./src/styles/Estilos";
import CadCategorias from "./src/pages/CadCategorias";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: corSecundaria,
            elevation: 0,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen
          name="MenuDrawer"
          component={MenuDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen name= "CadContas" component={CadContas} options={{ title: 'Cadastro de Contas' }} />
        <Stack.Screen name= "CadCategorias" component={CadCategorias} options={{ title: 'Cadastro de Categorias' }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
