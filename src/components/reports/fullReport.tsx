import { format } from 'date-fns';
import FullReportFiter from './fullReportFilters';

const FullReport = ({ fullReportRes,employeeList,projects ,clients}: any) => {
  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    // Format time string to HH:mm
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  return (
    <>
      <div id='FullReport' role='tabpanel'>
        <div className='card custom-card team_card employee_status'>
          <FullReportFiter clients={clients} projects={projects} employeeList={employeeList} />
          <div className='card-body Upwork_table employee_table'>
            <div className='table-responsive theme_table theme_table_sm'>
              <table className='table text-nowrap table-hover border table-bordered'>
                <thead>
                  <tr >
                    <th scope='col'>Name</th>
                    <th scope='col' className='project-width'>Project Name</th>
                    <th scope='col'>Client Name</th>
                    <th scope='col' className='module-width'>Module</th>
                    <th scope='col' className='profile-width'>Profile</th>
                    <th scope='col' className='memo-width'>Memo </th>
                    <th scope='col'>Upwork Hours</th>
                    <th scope='col'>Fixed Billing Hours</th>
                    <th scope='col'>Non Billable Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {fullReportRes?.map((item: any, index: any) => (
                    <>
                      <tr key='mainusers'>
                        <td colSpan={10}  className='maindate'>
                          <span className='badge'>{format(new Date(item.date), 'dd/MM/yyyy')}</span>
                        </td>
                      </tr>
                      {item.reportViewModel.map((reportItem: any, reportIndex: number) => (
                        <tr key={`report-${index}-${reportIndex}`}>
                          <td><b>{reportItem.employee}</b></td>
                          <td>{reportItem.projectName}</td>
                          <td>{reportItem.client}</td>
                          <td>{reportItem.module}</td>
                          <td>{reportItem.profile}</td>
                          <td>
                            <div className='memo_ellipse'>{reportItem.memo}</div>
                          </td>
                          <td>{numberToTimeConversion(reportItem.upworkHours)}</td>
                          <td>{numberToTimeConversion(reportItem.fixedHours)}</td>
                          <td className='text-danger'>{numberToTimeConversion(reportItem.nonBillableHours)}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullReport;
