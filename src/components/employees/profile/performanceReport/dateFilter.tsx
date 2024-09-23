'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const DateFilter = ({ projectBillingStatusParam }: any) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const url = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromParam = searchParams.get('From');
    const toParam = searchParams.get('To');
    setStartDate(fromParam || projectBillingStatusParam.fromDate);
    setEndDate(toParam || projectBillingStatusParam.toDate);
  }, [searchParams, projectBillingStatusParam]);

  const handleStartDate = (e: { target: { value: string } }) => {
  
    const startDateValue = e.target.value;
    setStartDate(startDateValue);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('From', startDateValue);
    if (endDate) {
      newSearchParams.set('To', endDate);
    }
    router.push(`${url}?${newSearchParams.toString()}`);
  };

  const handleEndDate = (e: { target: { value: string } }) => {
    const endDateValue = e.target.value;
    setEndDate(endDateValue);

    const newSearchParams = new URLSearchParams(searchParams);
    if (startDate) {
      newSearchParams.set('From', startDate);
    }
    newSearchParams.set('To', endDateValue);
    router.push(`${url}?${newSearchParams.toString()}`);
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