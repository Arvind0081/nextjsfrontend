'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProjectExcelReport from './projectReportExcel';

// Function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DateFilter = ({ endDate }: { endDate?: string }) => {
  const router = useRouter();
  const url = usePathname();
  const searchParams = useSearchParams();

  // Get Params
  const activeTab = searchParams.get('tab');
  const currentPage = searchParams.get('pageNumber') || '1';
  const pageSize = searchParams.get('pageSize') || '10';
  const searchQuery = searchParams.get('search') || '';
  const initialHoursFrom = searchParams.get('hoursFrom') || getCurrentDate();
  const initialHoursTo = searchParams.get('hoursTo') || getCurrentDate();

  // Declare State
  const [currentProjectDate, setCurrentProjectDate] = useState<string | undefined>(endDate);
  const [hoursFrom, setHoursFrom] = useState<string>(initialHoursFrom);
  const [hoursTo, setHoursTo] = useState<string>(initialHoursTo);

  // Effect to update the URL when state changes
  useEffect(() => {
    const queryParams = new URLSearchParams({
      tab: activeTab || '',
      projectStartDate: currentProjectDate || '',
      hoursFrom,
      hoursTo,
      pageNumber: currentPage,
      pageSize,
      search: searchQuery,
    });

    router.push(`${url}?${queryParams.toString()}`);
  }, [currentProjectDate, hoursFrom, hoursTo, currentPage, pageSize, searchQuery, activeTab, url, router]);

  const handleProjectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProjectDate(e.target.value);
  };

  const handleHoursFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursFrom(e.target.value);
  };

  const handleHoursTo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoursTo(e.target.value);
  };

  const handleSearch = () => {
    // Trigger the URL update with the current state
    const queryParams = new URLSearchParams({
      tab: activeTab || '',
      projectStartDate: currentProjectDate || '',
      hoursFrom,
      hoursTo,
      pageNumber: currentPage,
      pageSize,
      search: searchQuery,
    });

    router.push(`${url}?${queryParams.toString()}`);
  };

  return (
    <div className='align-items-end d-flex gap-x-2 selectbox'>
      <p className='fw-semibold mb-2 nowrap'>Project Start Date:</p>
      <div className='input-group date-selectbox'>
        <input
          type='date'
          className='form-control'
          value={currentProjectDate || ''}
          onChange={handleProjectDate}
        />
      </div>
      <p className='fw-semibold mb-2 nowrap'> From:</p>
      <div className='input-group date-selectbox'>
        <input
          type='date'
          className='form-control'
          value={hoursFrom}
          onChange={handleHoursFrom}
        />
      </div>
      <p className='fw-semibold mb-2 nowrap'> To:</p>
      <div className='input-group date-selectbox'>
        <input
          type='date'
          className='form-control'
          value={hoursTo}
          onChange={handleHoursTo}
        />
      </div>
      <div className='btn-list mt-md-0 mt-2  nowrap'>
        <button
          type='button'
          className='btn btn-primary btn-wave'
          onClick={handleSearch}
        >
          Search
        </button>
        <ProjectExcelReport />
      </div>
    </div>
  );
};

export default DateFilter;
