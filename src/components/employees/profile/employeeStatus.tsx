'use client';
import { useEffect, useState } from 'react';

const EmployeeStatus = ({ projectStatusList }: any) => {
  let lastDate = '';
  let lastStatusSubmitDate = '';
  const [currentMonth, setCurrentMonth] = useState('');
  const [filteredProjectStatusList, setFilteredProjectStatusList] =
    useState(projectStatusList);

  const handleMonthChange = (e: any) => {
    const month = e.target.value;
    setCurrentMonth(month);

    const filteredList = projectStatusList?.filter((status: any) => {
      const statusMonth = new Date(status.date).toISOString().slice(0, 7);
      return statusMonth === month;
    });

    setFilteredProjectStatusList(filteredList);
  };

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${year}-${month}`);
  }, []);

  useEffect(() => {
    if (currentMonth) {
      const filteredList = projectStatusList?.filter((status: any) => {
        const statusMonth = new Date(status.date).toISOString().slice(0, 7);
        return statusMonth === currentMonth;
      });
      setFilteredProjectStatusList(filteredList);
    }
  }, [currentMonth, projectStatusList]);

  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  

  return (
    <>
      <div className='card custom-card'>
        <div className='card-body Upwork_table employee_table employee_status'>
          <div className='d-flex justify-content-end items-center'>
            <div className='align-items-end d-flex gap-x-2 selectbox'>
              <p className='fw-semibold mb-2 nowrap'>Select Month</p>
              <div className='input-group date-selectbox'>
                <input
                  type='month'
                  className='form-control'
                  value={currentMonth}
                  onChange={handleMonthChange}
                />
              </div>
            </div>
          </div>
          <div className='table-responsive theme_table'>
            <table className='table text-nowrap table-hover border table-bordered'>
              <thead>
                <tr>
                  <th scope='col'>Date</th>
                  <th scope='col'>Updated on</th>
                  <th className='project-width'>Project Name</th>
                  <th scope='col'>Client Name</th>
                  <th scope='col' className='module-width'>
                    Module
                  </th>
                  <th scope='col' className='profile-width'>
                    Profile
                  </th>
                  <th scope='col' className='memo-width'>
                    Memo
                  </th>
                  <th scope='col'>Upwork Hours</th>
                  <th scope='col'>Fixed Billing Hours</th>
                  <th scope='col'>Non Billable Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjectStatusList?.length === 0 ? (
                  <tr>
                    <td colSpan={10} className='text-center'>No data found</td>
                  </tr>
                ) : (
                  filteredProjectStatusList?.map((status: any, index: any) => {
                    const currentDate = new Date(
                      status.date
                    ).toLocaleDateString();
                    const currentStatusSubmitDate = new Date(
                      status.statusSubmitDate
                    ).toLocaleDateString();

                    const isFirstOccurrenceDate = currentDate !== lastDate;
                    const isFirstOccurrenceUpdatedOn =
                      currentStatusSubmitDate !== lastStatusSubmitDate;

                    if (isFirstOccurrenceDate) lastDate = currentDate;
                    if (isFirstOccurrenceUpdatedOn)
                      lastStatusSubmitDate = currentStatusSubmitDate;

                    return (
                      <tr key={index}>
                        <td>
                          {isFirstOccurrenceDate && (
                            <span className='badge badge-primary bg-primary fs-10'>
                              {currentDate}
                            </span>
                          )}
                        </td>
                        <td>
                          {isFirstOccurrenceUpdatedOn && (
                            <span>{currentStatusSubmitDate}</span>
                          )}
                        </td>
                        <td>{status.projectName}</td>
                        <td>{status.clientName}</td>
                        <td>{status.moduleName}</td>
                        <td>{status.profileName}</td>
                        <td>{status.memo}</td>
                        <td>{numberToTimeConversion(status.upworkHours)}</td>
                        <td>{numberToTimeConversion(status.fixedHours)}</td>
                        <td className='text-danger'>{numberToTimeConversion(status.offlineHours)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeStatus;