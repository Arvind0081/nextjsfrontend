'use client';
import DateFilter from '@/components/hrReports/dateFilter';
import ExportExcel from '@/components/hrReports/exportExcel';
import { useSearchParams } from 'next/navigation';
import AttendanceReportPagination from '../projects/attendanceReportPagination';
const AttendanceReport = ({ hrReportList }: any) => {
  const searchParams = useSearchParams();
  const totalCount = hrReportList?.totalCount || 0;

const currentPage: any = searchParams?.get('pageNumber') ?? 1;
const pageSize: any = searchParams?.get('pageSize') ?? 10;
const searchQuery = searchParams?.get('search') ?? '';
const totalEntries =
    totalCount < pageSize * currentPage ? totalCount : pageSize * currentPage;

  let data: any = {
    pageNo: currentPage,
    pageSize: pageSize,
    searchValue: searchQuery ?? '',
  };
  return (
    <>
      <div
        className='tab-pane active show'
        id='AttandanceReport'
        role='tabpanel'
      >
        <div className='card custom-card team_card'>
          <div className='card-header justify-content-between awards_card_header'>
            <div className='card-title'>Attendance</div>
            <div className='filter-right d-flex gap-x-2'>
              <div className='align-items-end d-flex gap-x-2 selectbox'>
                <div className='input-group date-selectbox'>
                  <DateFilter />
                </div>
              </div>
              <div className='btn-list mt-md-0 mt-2'>
                <ExportExcel />
              </div>
            </div>
          </div>
          <div className='card-body'>
            <div className='table-responsive attendance_table'>
              <table className='border-primary hours-table table table-bordered text-nowrap attendance_layout'>
                <thead>
                  <tr>
                    <th scope='col'>Name</th>
                    {hrReportList?.results[0]?.attendanceReports.map(
                      (data: any, index: any) => (
                        <th scope='col' key={index}>
                          {data.day}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {hrReportList?.results?.map((item: any) => (
                    <tr key={item.employeeNumber}>
                      <th>
                        {item.employeeName}
                        <div className='text-grey'>{item.employeeNumber}</div>
                      </th>

                      {item.attendanceReports.map((employeeDetail: any) => (
                        <td className='present' key={employeeDetail.day}>
                          {employeeDetail.attendanceStatus === 'H' ? (
                            <div className='attendance_status_info'>
                              <div className='attendance_status Present_status'>
                                {employeeDetail.attendanceStatus}
                              </div>
                            </div>
                          ) : (
                            <div className='attendance_status_info'>
                              <div className='attendance_status Present_status'>
                                {employeeDetail.attendanceStatus}
                              </div>
                              <div className='_BM_attendance'>
                                <div className='attendance_status_3t'>
                                  <span className='threeT_info'>3t</span>
                                  <span className='threeT__attendance'>
                                    {employeeDetail.attendanceStatus}
                                  </span>
                                  <span className='threeT-time'>
                                    {employeeDetail.dayHours}
                                  </span>
                                </div>
                                <div className='attendance_status_bm bg-white'>
                                  <span className='BM_info'>BM</span>
                                  <span className='BM__attendance bg-white'>
                                    N/A
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='card-footer'>
                <div className='d-flex align-items-center pagination_layout'>
                  <div>
                    Total Showing Entries {totalEntries} out of{' '}
                    {hrReportList?.totalCount ?? 0}
                    <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
                  </div>

                  <div className='ms-auto'>
                    <nav>
                      <AttendanceReportPagination
                        totalRecords={hrReportList?.totalCount}
                        data={data}
                      />
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AttendanceReport;
