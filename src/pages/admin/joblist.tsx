import BottomNavigationBar from '@/components/Company/Layouts/BottomNavigationBar'
import SidebarCompany from '@/components/Company/Layouts/SidebarCompany'
import Sidebar from '@/components/User/Layouts/Sidebar'
import { BriefcaseIcon, BuildingOffice2Icon } from '@heroicons/react/24/solid'
import { AdminPanelSettings, AdminPanelSettingsTwoTone, Logout } from '@mui/icons-material'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import SidebarAdmin from '@/components/admin/Layouts/SidebarAdmin'
import Dashboard from '@/components/admin/Dashboard'
import { adminAuthentication } from '@/config/companyendpoints'
import CompanyListComponent from '@/components/admin/CompanyListComponent'
import swal from 'sweetalert'
import { useRouter } from 'next/router'
import UserListsComponent from "@/components/admin/UserLists"
import JobListComponent from '@/components/admin/JobListComponent'

function UsersList() {
    const router = useRouter()
    const [adminDetails, setAdminDetails] = useState('')
    useEffect(() => {
        async function invoke(){
            if(localStorage.getItem("admintoken")){
                const data = await adminAuthentication({"admintoken":localStorage.getItem("admintoken")})
               
                if(data.status ==="failed"){
                  router.push('/admin/login')
                }else if(data.auth){
             
                    setAdminDetails(data?.email)
                }else{
                    router.push('/admin/login')
                }
            }else{
                router.push('/admin/login')
            }
            
        }
        invoke();
    
     }, [])

     const logout=()=>{
        swal({
          title: "Are you sure?",
          text: "Once logout, you need to add credentials when login",
          icon: "warning",
          buttons: ["cancel","any"],
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            localStorage.removeItem('admintoken')
            router.push('/admin/login')
          } 
        });
      }
  return (
    <>
    <Head>
      <title>Seeker</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
      {/* sidebar */}
      {/* userDetails ={userDetails} */}
      <SidebarAdmin />
      <div className="flex-grow border-l border-r border-gray-700 max-w sm:ml-[73px] xl:ml-[370px]">
        <div className="flex item-center px-1.5 py-2 border-b border-r border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
          <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0">
            <AdminPanelSettings className="h-9 text-white" />
          </div>
          Users
          <div className="text-[#d9d9d9] flex item-center justify-center hoverAnimation sm:ml-auto xl:-mr-5 ml-auto mt-auto">
          <AdminPanelSettingsTwoTone className="h-10 w-10 rounded-full xl:mr-2.5"/>
            <div className="hidden xl:inline leading-4">
              <p className="font-medium text-base">Admin</p>
              <p className="text-[#6e767d] text-sm">{adminDetails}</p>
            </div>
            
          </div>
          <Logout className=" h-5 pl-4 mt-4 w-9 rounded-full xl:mr-2.5 cursor-pointer" onClick={logout} />
        </div>
     <JobListComponent />
        <div className="pb-72"></div>
      </div>
      {/* feed */}
      {/* <Feed /> */}

      {/* widgets */}

      {/* modal */}
    </main>
  </>
    )
}

export default UsersList