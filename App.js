import AppNav from "./navigations/AppNav";
import Provider from "./config/Provider";
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App(){
  return (
    <RootSiblingParent>
      <Provider>
        <AppNav />
      </Provider>
    </RootSiblingParent>
  )
}
