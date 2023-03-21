import { GetChatUsers } from '@/config/endpoints'
import React, { useEffect, useState } from 'react'

function OneChat({chat,companyDetails,setCurrentChat,refresh,setRefresh}:any) {
    const [userData, setUserData] = useState<any>(null)
    const [chatCount,setChatCount]=useState<any>(null)
    // const [refresh,setRefresh] = useState<any>(false)

    useEffect(()=> {

        const companyId = chat?.members.find((id:any)=>id!==companyDetails?._id)
        const invoke= async()=>{
        const data = await GetChatUsers(companyId,chat?._id)
        setUserData(data?.user)
        console.log(data?.result)
        setChatCount(data?.result)
        

        }

        invoke();
    },[refresh])
  return (

         <div
         onClick={()=>{
          setCurrentChat(chat)
          setRefresh(!refresh)
          
        }}
          key={chat?._id}
          className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center">
          <img
            src={userData?.image? userData.image :''  }
            width={50}
            height={50}
            // objectFit="cover"
            className="relative rounded-full object-cover" alt={""}  />
            {
              chatCount !=0 && (
                <div className='bg-red-600 -mt-9 absolute rounded-full h-6 w-6 text-white'>
            <p className='text-center'>{chatCount}</p>
                </div>
              )
            }
            
          <div className="ml-4 leading-5 group  hidden sm:block">
            <h4 className="font-bold group-hover:underline">
            {userData?.firstname? userData?.firstname : userData?.company} {userData?.lastname}
      
            </h4>
            <h5 className="text-gray-500 text-[15px]">{userData?.recentjob? userData?.recentjob : userData?.industry} </h5>
          </div>
          
          <button onClick={()=>{
            setCurrentChat(chat)
            setRefresh(!refresh)
          
          }} className="ml-auto hidden md:block bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
            chat
          </button>
  
    </div>
  )
}

export default OneChat