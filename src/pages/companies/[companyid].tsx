import Feed from "@/components/User/Feed/Feed";
import Sidebar from "@/components/User/Layouts/Sidebar";
import axios from "@/config/axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { user } from "@/redux/signupdetails";
import { useRouter } from "next/router";
import Head from "next/head";

import { BriefcaseIcon } from "@heroicons/react/24/solid";
import Jobs from "@/components/User/Jobs/Jobs";
import { ArrowBack, Logout } from "@mui/icons-material";
import swal from "sweetalert";
import BottomNavigationBar from "@/components/Company/Layouts/BottomNavigationBar";
import Widgets from "@/components/User/Feed/Widgets";
import UserProfile from "@/components/User/UserProfile";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import Moment from "react-moment";
import {
  CompanyWiseJobFetch,
  getOneCompanyNoAuth,
  getProfilePosts,
  getQuestion,
  postQuestion,
} from "@/config/endpoints";
import Posts from "@/components/User/Feed/Posts";
import UserInfos from "@/components/User/UserInfos";
import CompanyProfile from "@/components/User/CompanyProfile";
import CompanyInfos from "@/components/User/CompanyInfos";
import JobContainer from "@/components/Company/JobContainer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import { dividerClasses } from "@mui/material";

function CompanDetailsPage({ company }: any) {
  let dispatch = useDispatch();
  //user
  const [jobs, setJobs] = useState([]);
  
  const { setPostRefresh, postRefresh }: any = useContext(AppContext);
  const users = useSelector((state: any) => state.user.value);
  const [switcher, setSwitcher] = useState<string>('job')
  const [qswitcher, setQswitcher] = useState<string>('bq')
  let [userDetails, setUserDetails] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [questions,setQuestions] = useState<any>([])
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      axios
        .get("/isUserAuth", {
          headers: { usertoken: localStorage.getItem("usertoken") },
        })
        .then((response) => {
          if (response.data.status === "failed") {
            router.push("/auth");
          } else if (response.data.auth) {
            dispatch(user(response.data));
            setUserDetails({
              name: `${response.data.firstname} ${response.data.lastname}`,
              recentjob: response.data.recentjob,
            });
          } else {
            router.push("/auth");
          }
        });
    } else {
      router.push("/auth");
    }
  }, []);

  useEffect(() => {
    async function invoke() {
      const data = await CompanyWiseJobFetch(company?._id, {
        usertoken: localStorage.getItem("usertoken"),
      });
      console.log(data);
      setJobs(data?.jobs);
    }
    invoke();
  }, [postRefresh]);

  useEffect(()=>{
  (async function(){
    const data =  await getQuestion(company?._id)
    setQuestions(data?.question)
  })();
  },[refresh])

  const logout = () => {
    swal({
      title: "Are you sure?",
      text: "Once logout, you need to add credentials when login",
      icon: "warning",
      buttons: ["cancel", "ok"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        localStorage.removeItem("usertoken");
        router.push("/auth");
      }
    });
  };

  const handleSubmits = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    //input datas
      const question = data.get("question");
      const result = await postQuestion({userId:users?.userId,question,companyId:company},{'usertoken':localStorage.getItem('usertoken')})
      if(result?.status == 'success'){
      setRefresh(!refresh)
      toast.success(`question succesfully added`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
     setQswitcher('bq')
      }else{
        toast.error(`something went wrong`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        
      }
  }
  return (
    <div className="">
      <Head>
        <title></title>
      </Head>

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        {/* sidebar */}

        <Sidebar userDetails={users} />
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex item-center px-1.5 py-2 border-b border-r border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0">
              <ArrowBack
                onClick={() => router.back()}
                className="h-7 text-white"
              />
            </div>
            Company Details
            <div className="hoverAnimation w-9 h-9 flex item-center justify-center xl:px-0 ml-auto">
              <Logout className="h-5 text-white" onClick={logout} />
            </div>
          </div>

          <CompanyProfile company={company} />

          <CompanyInfos company={company} />

          <div className="pb-72 mt-5 text-white">
            <div className="flex items-center justify-center border-b pb-3 border-gray-500">
              <h4 className={`ml-5 font-semibold text-center border rounded cursor-pointer px-4 hover:bg-green-500 ${switcher == 'job' && 'bg-white text-black'}`} onClick={() => setSwitcher('job')}>JOBS</h4>
              <h4 className={`ml-5 font-semibold text-center border rounded cursor-pointer px-4 ${switcher == 'qa' && 'bg-white text-black'}`} onClick={() => setSwitcher('qa')}>Q&A</h4>
            </div>

            {
              switcher == 'qa' && (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 p-5 cursor-pointer">
                  <div className="flex justify-center gap-2 border-b pb-2 border-gray-700">
                    <h6 className={` cursor-pointer ${qswitcher == 'bq' && 'underline font-bold'}`} onClick={() => setQswitcher('bq')}>Browse questions</h6>
                    <h6 className={`cursor-pointer  ${qswitcher == 'aq' && 'underline font-bold'}`} onClick={() => setQswitcher('aq')}>Ask questions</h6>
                  </div>
                  {
                    qswitcher == 'bq' && (
                     questions?.map((qs:any)=>(
                       <div key={qs?._id} className="border rounded py-3 px-2">
                          <div className="flex gap-2  ">
                            <div className=" text-white">
                              <Image src={qs?.user?.image} width={60} height={60} alt="err" className="rounded-full" />
                            </div>
                            <div className="">
                              <h4 className="text-md font-medium text-white">{qs?.user?.firstname} {qs?.user?.lastname}</h4>
                              <p className="text-sm text-gray-500 -mt-2">{qs?.user?.recentjob}</p>
                              <p className="text-lg">{qs?.question}</p>
                              <p className="text-sm text-gray-400">{qs?.answer &&  <Moment fromNow>{ qs?.updatedAt}</Moment>}</p>
                            </div>
                          </div>
                          <div className="bg-gray-900 rounded">
                            <p className="pl-3">{qs?.answer && qs?.answer} {!qs?.answer && 'not answered'}</p>
                          </div>
                        </div>
                     ))
                      

                      )
                  }
                  
                  {
                     qswitcher == 'aq' && (
                      <div>
                        <div>
                          <h3 className="text-lg">Tips to get helpful answers</h3>
                          <p className="text-sm">1. Check that your question hasnt been asked</p>
                          <p className="text-sm">2. Ask a direct questions</p>
                          <p className="text-sm">3. Check your spelling and grammer</p>
                        </div>
                        <div className="mt-3">
                          <form onSubmit={handleSubmits}>
                            <textarea placeholder="write your question" name="question" id="" className="w-full rounded min-h-40 bg-slate-800 placeholder:pl-3 min-h-[100px]"></textarea>
                            <div className="flex mt-2">
                            <button type="submit" className="ml-auto bg-blue-600 py-1 px-3 rounded font-semibold ">submit</button>
                            </div>
                          </form>
                        </div>
                      </div>
                     )
                  }
                </div>
              )
            }
            <div className=" flex items-center justify-center">
              <ToastContainer />
              {
                switcher == 'job' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 p-5 cursor-pointer">
                    {jobs &&
                      jobs.map((job: any) => (
                        <JobContainer
                          key={job?._id}
                          job={job}
                          applied={false}
                          refresh={refresh}
                          setRefresh={setRefresh}
                        />
                      ))}
                  </div>
                )
              }



            </div>
          </div>
        </div>

        {/* feed */}

        {/* widgets */}
        <Widgets />

        {/* modal */}
        <BottomNavigationBar />
      </main>
    </div>
  );
}

export default CompanDetailsPage;

export async function getServerSideProps(context: any) {
  const companyId = context.params.companyid;
  const data = await getOneCompanyNoAuth(companyId);

  return {
    props: {
      company: data?.company || null,
    },
  };
}
