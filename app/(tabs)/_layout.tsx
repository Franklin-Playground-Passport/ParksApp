import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { BottomNavigation, Provider } from "react-native-paper";

import ExploreScreen from "./explore";
import HomeScreen from "./home";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Provider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            inactiveColor="gray"
            activeColor="blue"
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) =>
              descriptors[route.key].options.tabBarIcon?.({
                focused,
                color,
                size: 24,
              }) || null
            }
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                typeof options.tabBarLabel === "string"
                  ? options.tabBarLabel
                  : typeof options.title === "string"
                  ? options.title
                  : route.name;

              return label;
            }}
          />
        )}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarLabel: "Explore",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="map-search"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </Provider>
  );
}
