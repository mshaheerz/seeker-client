import { GetChatUsers, addMessages, getMessages, messageSortHelper } from "@/config/endpoints";
import { useEffect, useRef, useState } from "react";
  import style from "@/styles/Home.module.css";
  import Moment from "react-moment";

function ChatBoxCompany({chat, companyDetails, setSendMessage, recieveMessage,refresh,setRefresh}:any) {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState<any>(null);

  const scroll = useRef<any>()
  useEffect(() => {
    const userId = chat?.members?.find((id: any) => id !== companyDetails?._id);
    const invoke = async () => {
      const data = await GetChatUsers(userId,chat?._id);
      setUserData(data?.user);
    };
    
    if (chat !== null) invoke();
  }, [chat, companyDetails]);

  useEffect(() => {
    const fetchmessages = async () => {
      const data = await getMessages(chat._id);
      setMessages(data);
    };
    if (chat !== null) fetchmessages();
  }, [chat]);


  useEffect(() => {
    console.log('message arrived', recieveMessage)
    if (recieveMessage !== null && recieveMessage?.chatId === chat?._id) {
      setMessages([...messages, recieveMessage]);
 
    }
  }, [recieveMessage]);


  //always scroll to last message
    useEffect(()=>{
       scroll.current?.scrollIntoView({behavior: "smooth"})
    }, [messages])



    const handleSend = async (e: any) => {
      e.preventDefault();
      const message = {
        senderId: companyDetails?._id,
        text: newMessage,
        chatId: chat?._id,
      };
  
          const recieverId = chat.members.find((id:any) => id !== companyDetails?._id);
              //send ,message to socket server
          console.log(message)
          setSendMessage({ ...message, recieverId });
        
      // send ,message to database
      try {
       
        const data = await addMessages(message);
        await messageSortHelper(chat?._id)
        setRefresh(!refresh)
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (error) {
        console.log(error);
      }

      };
  



  return (
    
    <div className="text-white bg-black w-[70%]  rounded">
      {!userData && (
        <div className="text-center mt-7 text-lg">Please select chat</div>
      )}
      {userData && ( <div className={style.ChatBoxcontainer}>
        <>
          <div className={style.chatheader}>
            <div className="follower text-white">
              <div className="flex">
                <img src={userData?.image} className="rounded-full" alt="" width={50} height={50} />
                <div className="name " style={{ fontSize: "0.8rem" }}>
                  <span className="text-base mt-5">
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
           <div className="border border-gray-700"></div>
          </div>

          {/* chat box messages */}

          <div className={`${style.chatbody} no-scrollbar`}>
            {messages?.map((message:any) => (
        
                <div
                  ref={scroll}
                  key={message?._id}
                  className={
                    message?.senderId === companyDetails?._id
                      ? `${style.message} ${style.own} mt-5`
                      : `${style.message} ${style.sender}`
                  }
                >
                  <span>{message?.text}</span>
                  <span>
                    <Moment fromNow>{message?.createdAt}</Moment>
                  </span>
                </div>
            
            ))}
          </div>
          {/* chat sender */}
          <form>
          <div className={`${style.chatsender} border rounded`}>
            <div>+</div>
            <input
              type="text"
              value={newMessage}
              onChange={(e: any) => setNewMessage(e.target.value)}
              className="text-white border border-white  bg-black  "
              placeholder="type a message"
              
            />
            <div>
              <button
              type="submit"
                className="bg-white text-black rounded px-4 text-bold disabled:bg-slate-500"
                onClick={handleSend}
                disabled={newMessage.trim()===""}
              >
                send
              </button>
            </div>
          </div>
          </form>
        </>
      </div>)}



    </div>
  )
}

export default ChatBoxCompany

