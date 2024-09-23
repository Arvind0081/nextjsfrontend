'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const DateFilter = ({ data }: any) => {
 
  const [startDate, setStartDate] = useState(data.startDate);
  const [endDate, setEndDate] = useState(data.endDate);
  const router = useRouter();
  const url = usePathname();

  const handleStartDate = (e: { target: { value: any } }) => {
    const startDateValue = e.target.value;
    setStartDate(startDateValue);
    router.push(
      `${url}/?startDate=${startDateValue}&endDate=${endDate}&date=${data.filterByDate}&month=${data.selectedMonth}`
    );
  };

  const handleEndDate = (e: { target: { value: any } }) => {
    const endDateValue = e.target.value;
    setEndDate(endDateValue);
    router.push(
      `${url}/?startDate=${startDate}&endDate=${endDateValue}&date=${data.filterByDate}&month=${data.selectedMonth}`
    );
  };

  return (
    <>
      <div className='align-items-end d-flex gap-x-2 selectbox'>
        <p className='fw-semibold mb-2'>From</p>
        <div className='input-group date-selectbox'>
          <input
            type='date'
            className='form-control'
            value={startDate}
            onChange={handleStartDate}
          />
        </div>
      </div>
      <div className='align-items-end d-flex gap-x-2 selectbox'>
        <p className='fw-semibold mb-2'>To</p>
        <div className='input-group date-selectbox'>
          <input
            type='date'
            className='form-control'
            value={endDate}
            onChange={handleEndDate}
          />
        </div>
      </div>
    </>
  );
};

export default DateFilter;
