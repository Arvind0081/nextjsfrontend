'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BillingTypeModel, HiringModel } from '@/utils/types';


const BillingAndHiringStatusFilter = ({data,hiringTypeFilter,billingTypeFilter}: any) => {

  const [hiringStatus, setHiringStatus] = useState(data.hiringStatus);
  const [billingStatus, setBillingStatus] = useState(data.bilingType);
  const router = useRouter();
  const url = usePathname();


  const handleChangeHiringStatus = (e: { target: { value: any } }) => {
    const hiringValue = e.target.value;
    setHiringStatus(hiringValue);
    router.push( `${url}/?page=${1}&size=${data.pageSize}&status=${data.projectStatus}&search=${data.searchValue}&startDate=${data.startDate}&endDate=${data.endDate}&hiringStatus=${hiringValue}&bilingType=${billingStatus}&teamAdminId=${data.teamAdminId}`);
router.refresh();  
};

  const handleChangeBillingStatus = (e: { target: { value: any } }) => {
    const billingValue = e.target.value;
    setBillingStatus(billingValue);
    router.push(`${url}/?page=${1}&size=${data.pageSize}&status=${data.projectStatus}&search=${data.searchValue}&startDate=${data.startDate}&endDate=${data.endDate}&hiringStatus=${hiringStatus}&bilingType=${billingValue}&teamAdminId=${data.teamAdminId}`);
router.refresh();  
  
};

  return (
    <>
        <div className='align-items-end d-flex gap-x-2 selectbox'>
        <p className='fw-semibold mb-2'>Billing Type</p>
        <div className='input-group date-selectbox'>
        <select value={billingStatus}
        onChange={handleChangeBillingStatus} className="form-control  mb-2">

              {billingTypeFilter?.map((item: BillingTypeModel) => (
                <option key={item.value} value={item.value}>
                  {' '}
                  {item.text}
                </option>
              ))}
                                                </select>
        </div>
      </div>
      <div className='align-items-end d-flex gap-x-2 selectbox'>
        <p className='fw-semibold mb-2'>Hiring Status</p>
        <div className='input-group date-selectbox'>
        <select value={hiringStatus}
        onChange={handleChangeHiringStatus} className="form-control mb-2">
              {hiringTypeFilter?.map((item: HiringModel) => (
                <option key={item.value} value={item.value}>
                  {' '}
                  {item.text}
                </option>
              ))}
                                                </select>
        
        </div>
      </div>
    </>
  );
};

export default BillingAndHiringStatusFilter;