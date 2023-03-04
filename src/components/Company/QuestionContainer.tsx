
import Image from "next/image";
import swal from 'sweetalert'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { answerQuestion,deleteQuestion } from "@/config/endpoints";
import Moment from "react-moment";
import { Delete } from "@mui/icons-material";
function QuestionContainer({qs,refresh,setRefresh}:any) {
    const [open, setOpen] = useState(false);
    const [ans, setAns] = useState<string>("")
    //companyInfo
  
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleDelete = async() => {
      swal({
        title: "Are you sure?",
        text: "This question is not a valid?",
        icon: "warning",
        buttons: ["cancel","ok"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          deleteQuestion(qs?._id)
          setRefresh(!refresh)
        }
      })
    }
    const handleSubmit =async (e:any) => {
      e.preventDefault()
      const data = await answerQuestion({answer:ans},qs?._id,{"companytoken":localStorage.getItem("companytoken")})
      setRefresh(!refresh)
      setOpen(false);
    }
    const style = {
        width: 400,
      };
  return (
    <div>

<div className="border rounded py-3 px-2">
               <div className="flex gap-2  ">
                 <div className=" text-white">
                   <Image src={qs?.user?.image} width={60} height={60} alt="err" className="rounded-full" />
                 </div>
                 <div className=" ">
                   <h4 className="text-md font-medium text-white">{qs?.user?.firstname} {qs?.user?.lastname}</h4>
                   <p className="text-sm text-gray-500 -mt-2">{qs?.user?.recentjob}</p>
                   <p className="text-lg text-white">{qs?.question}</p>
                   <p className="text-sm text-gray-400">asked <Moment fromNow>{qs?.createdAt}</Moment></p>
                 </div>
                 <div className="ml-auto "><button onClick={handleClickOpen} className="bg-white border rounded px-3 font-bold hover:bg-blue-700 hover:text-white">{qs?.answer?'Edit':'Answer'}</button></div>
                 <div className="">
                <Delete className="text-white cursor-pointer hover:text-red-700" onClick={handleDelete} /> 
               </div>
               </div>
             
               <div>
                 <p className="bg-gray-700 rounded text-white" >{qs?.answer && qs?.answer} {!qs?.answer && 'not answered'}</p>
               </div>
             </div>
        <Dialog open={open} onClose={handleClose} >
        <DialogTitle>Answer</DialogTitle>
        <DialogContent sx={style}>
          <DialogContentText>
            {
                qs?.question
            }
          </DialogContentText>
          <textarea placeholder="write your answer here" onChange={(e:any)=>setAns(e.target?.value)} className="w-full bg-slate-200"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default QuestionContainer