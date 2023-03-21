import { GetChatUsers } from "@/config/endpoints"
import { useEffect, useState } from "react"
import OneChat from "./OneChat"


function ChatList({companyDetails,chats,setCurrentChat,refresh,setRefresh}:any) {
  
    
  return (
    <div className="bg-[#15181c] grid-5 sm:w-[30%] w-[16%]  h-screen rounded">
     <div className="text-white">
     <div className="text-[#d9d9d9] space-y-3 bg-[#15181c] pt-2 rounded-xl w-11/12 xl:w-12/12">
      <h4 className="font-bold sm:text-xl text-sm sm:px-4">New chats</h4>
      {
        
        chats?.map((chat:any)=>
           <OneChat key={chat?._id} onClick={()=>{setCurrentChat(chat)}} refresh={refresh} setRefresh={setRefresh} setCurrentChat={setCurrentChat} chat={chat} companyDetails={companyDetails}  /> 
        )
      }
      
      </div>
     </div>
    </div>
  )
}

export default ChatList