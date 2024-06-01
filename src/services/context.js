import { createContext, useState } from "react";
import { getUser,setUser as updateUser } from "./storage";


export const initialUser = {
    isAuth: false,
    roles: [],
    profile:"",
    name: null,
    token: null,
    token_refresh: null,
}

export const initDataShared = {}

export const AppContext = createContext({
    user:initialUser,
    dataShared:initDataShared,
    onCniChange: (data) => {},
    onUserChange: (data) => {}
})

export const AppContextProvider = ({children}) => {
    const usrLocal = getUser() || initialUser //recuperation de l'utilisateur dans localStorage
    const [usr, setUser] = useState(usrLocal)
    const [dataShared, setDataShared] = useState(initDataShared)
    const handleDataSharedChange = (c) => {
        //console.log("new data ")
        //console.log(c)
        setDataShared(c)
    }
    const handleAuthChange = (c) => {
        
        setUser(c)
        updateUser(c);
    }

    const contextValue = {
        user: usr,
        onUserChange:handleAuthChange,
        dataShared: dataShared,
        onDataSharedChange:handleDataSharedChange,
    }

    return(
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}