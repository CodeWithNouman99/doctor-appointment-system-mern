import { createContext, useEffect, useState } from "react";
import {doctors} from "../assets/assets_frontend/assets"
import axios from "axios"

export const AppContext=createContext()
const AppContextProvider=(props)=>
{
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [doctor,setDoctor]=useState([])
    const value={
        doctors
    }
    const getdoctorsData=async()=>
    {
        try{
            const {data}=await axios.get(backendUrl+"/api/doctor/list")
            if(data.success)
            {
                setDoctor(data.doctor)
            }
        }catch(err)
        {
            console.log(err)
        }
    }
    useEffect(()=>
    {
        getdoctorsData()
    })
    return(
        <AppContext.Provider value={value}>
            {
                props.children
            }
        </AppContext.Provider>
    )
}


export default AppContextProvider