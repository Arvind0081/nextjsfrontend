'use client';
import React from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import * as XLSX from 'xlsx';
import { hrReports } from '@/utils/publicApi';
import { useSearchParams } from 'next/navigation';
import { AttendenceFormValue } from '@/utils/types';

import getUser from '@/utils/getUserClientSide';

const ExportExcel = () => {
  let user: any = getUser();
  const searchParams = useSearchParams();
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const hrDepSelected = searchParams?.get('departmentId');
  let roleDepartmentID =
    hrDepSelected != null ? hrDepSelected : user?.departmentId;
  let dateStr = searchParams.get('month');
  if (dateStr == undefined) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    dateStr = `${year}-${month}`;
  }
  let [year, month] = dateStr.split('-');

  const handleExportToExcel = async () => {
    try {
      const attendence: AttendenceFormValue = {
        Month: Number(month) ?? currentMonth,
        Year: Number(year) ?? currentYear,
        designations: '',
        IsActive: 0,
        DepartmentId: roleDepartmentID,
        PageNumber: 0,
        PageSize: 0,
        SearchValue: '',
        TeamAdminId: '',
      };

      const response = await hrReports(attendence);

      // Check for successful response
      if (response.results != null) {
        const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

        // Prepare header row
        const headers = [
          'Employee Name',
          'Employee Number',
          ...Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`)
        ];

        // Transform the data
        const transformedData = response.results.map((employee: any) => {
          // Create an array for the row data
          const rowData = Array(daysInMonth).fill(''); // Initialize with empty strings for each day

          // Fill in attendance data
          employee.attendanceReports.forEach((report: any) => {
            const dayIndex = report.day - 1; // Convert day to zero-based index
            if (report.attendanceStatus) {
              rowData[dayIndex] = `${report.attendanceStatus} - ${report.dayHours}`;
            } else {
              rowData[dayIndex] = `${report.dayHours}`;
            }
          });

          return [employee.employeeName, employee.employeeNumber, ...rowData];
        });

        // Add header to the data
        const finalData = [headers, ...transformedData];
        const worksheet = XLSX.utils.aoa_to_sheet(finalData); // Use aoa_to_sheet for array of arrays
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'DataSheet.xlsx');

        // Display success message
        toastr.success('File downloaded successfully', '', {
          timeOut: 1000,
        });
      } else {
        toastr.error('Failed to download file', '', { timeOut: 1000 });
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toastr.error('An error occurred while exporting to Excel', '', {
        timeOut: 1000,
      });
    }
  };

  return (
    <button
      className='btn'
      style={{ backgroundColor: '#7952b3', color: 'white' }}
      onClick={handleExportToExcel}
    >
      <i className='bi bi-file-excel-fill'></i> Export to Excel
    </button>
  );
};

export default ExportExcel;
