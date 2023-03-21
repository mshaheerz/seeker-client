import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { GetChatUsers } from '@/config/endpoints';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
function ChatContainer({chat,currentUser,setCurrentChat,route,setRefresh,refresh}:any) {
  const router = useRouter()
    const [userData, setUserData] = useState<any>(null)
    const [chatCount,setChatCount]=useState<any>(null)
   const users = useSelector((state:any)=>state.user.value)
    useEffect(()=> {

        const userId = chat?.members.find((id:any)=>id!==users?.userId)
        const invoke= async()=>{
        const data = await GetChatUsers(userId,chat?._id)
        console.log(data)
        setUserData(data?.user)
        console.log(data)
        setChatCount(data?.result)

        }

        invoke();
    },[refresh,chat])
  return (
    <div
          onClick={()=>{
            setCurrentChat(chat)
            setRefresh(!refresh)
            if(route) router.push('/chat')

          
          }}
          className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center">
          <img
            src={userData?.image? userData.image :''  }
            width={50}
            height={50}
            // objectFit="cover"
            className="relative rounded-full object-cover" alt={""}          />
            {
              chatCount !=0 && (
                <div className='bg-red-600 -mt-9 absolute rounded-full h-6 w-6 text-white'>
            <p className='text-center'>{chatCount}</p>
                </div>
              )
            }
          <div className="ml-4 leading-5 group hidden sm:block">
            <h4 className="font-bold group-hover:underline">
            {userData?.firstname? userData?.firstname : userData?.company} {userData?.lastname}
            </h4>
            <h5 className="text-gray-500 text-[15px]">{userData?.recentjob? userData?.recentjob : userData?.industry} </h5>
          </div>
          <button onClick={()=>setCurrentChat(chat)} className="ml-auto hidden sm:block bg-white text-black rounded-full font-bold text-sm py-1.5 px-3.5">
            chat
          </button>
    </div>

  )
}

export default ChatContainer