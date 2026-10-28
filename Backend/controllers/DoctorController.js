import doctorModel from "../models/DoctorModel.js";

const changeAvailability=async(req,res)=>
{
    try{
        const {docId}=req.body
        const docData=await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{availabe:!docId.availabe})
        res.json({success:true,message:"Availability changed"})
    }catch(error)
    {
        onsole.log(error);
    res.json({ success: false, message: error.message });
    }
}

export default changeAvailability