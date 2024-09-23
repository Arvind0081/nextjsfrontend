'use client'
import React, { useState } from 'react';
import { useRouter,usePathname } from 'next/navigation';

const DateFilter=({payload}:any)=>{

    let paramsModuleData:string[]=[];
    let paramsPaymentData:string[]=[];
 
    if(Array.isArray(payload.moduleStatus)){
       paramsModuleData=[...payload.moduleStatus]
    }
    else{
       if(payload.moduleStatus!==''){ paramsModuleData=[payload.moduleStatus]}
    }
 
    if(Array.isArray(payload.paymentStatus)){
       paramsPaymentData=[...payload.paymentStatus]
    }
    else{
       if(payload.paymentStatus!==''){ paramsPaymentData=[payload.paymentStatus]} 
    }
   

    const [startDate,setStartDate]=useState(payload.startDate);
    const [endDate,setEndDate]=useState(payload.endDate);
    const router=useRouter();
    const url=usePathname();

    const handleStartDate=(e: { target: { value: any; }; })=>{
        const startDateValue=e.target.value;
        setStartDate(startDateValue);

        const moduleStatusString = paramsModuleData.length>0
        ? paramsModuleData.join('&ModuleStatus=')
        : '';
     
        const paymentStatusString = paramsPaymentData.length>0
        ? paramsPaymentData.join('&PaymentStatus=')
        : '';

        router.push(`${url}/?ProjectId=${payload.id}&ModuleStatus=${moduleStatusString}&PaymentStatus=${paymentStatusString}&StartDate=${startDateValue}&EndDate=${endDate}&PageSize=${payload.pageSize}&PageNumber=${payload.pageNumber}`);
router.refresh();
    };

    const handleEndDate=(e: { target: { value: any; }; })=>{
        const endDateValue=e.target.value;
        setEndDate(endDateValue);

        const moduleStatusString = paramsModuleData.length>0
        ? paramsModuleData.join('&ModuleStatus=')
        : '';
     
        const paymentStatusString = paramsPaymentData.length>0
        ? paramsPaymentData.join('&PaymentStatus=')
        : '';

        router.push(`${url}/?ProjectId=${payload.id}&ModuleStatus=${moduleStatusString}&PaymentStatus=${paymentStatusString}&StartDate=${startDate}&EndDate=${endDateValue}&PageSize=${payload.pageSize}&PageNumber=${payload.pageNumber}`);
        router.refresh();
    };


    return(
        <>
       
                                       <div className="align-items-end d-flex gap-x-2 selectbox">
                                          <p className="fw-semibold mb-2">From</p>
                                          <div className="input-group date-selectbox">
                                          <input
                    type='date'
                    className='form-control'
                    value={startDate}
                   onChange={handleStartDate}
                />
                                          </div>
                                       </div>
                                       <div className="align-items-end d-flex gap-x-2 selectbox">
                                          <p className="fw-semibold mb-2">To</p>
                                          <div className="input-group date-selectbox">
                                          <input 
                 type='date'
                 className='form-control'
                 value={endDate}
                onChange={handleEndDate}
             />
                                          </div>
                                       </div>
      
        </>
        
    )
}

export default DateFilter;