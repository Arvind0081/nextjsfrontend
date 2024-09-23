'use client';
import DateFilter from './developerProductiveDateFilter';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ReportPagination from './pagination';
import ReportDetailsButton from './reportDetailsButton';
import { format } from 'date-fns';
import Link from 'next/link';
const DeveloperReport = ({ developersReports }: any) => {
  //Initialize hook
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = usePathname();

  // Calculate Time
  let today = new Date();
  let startDate = format(
    new Date(today.setDate(today.getDate() - 6)),
    'yyyy-MM-dd'
  );
  let endDate = format(new Date(), 'yyyy-MM-dd');
  // Get Params
  const activeTab = searchParams?.get('tab');
  const hoursFrom = searchParams?.get('hoursFrom') ?? startDate;
  const hoursTo = searchParams?.get('hoursTo') ?? endDate;
  const currentPage: any = searchParams?.get('pageNumber') ?? 1;
  const pageSize: any = searchParams?.get('pageSize') ?? 10;
  const searchQuery = searchParams?.get('search') ?? '';
  const totalCount = developersReports?.totalCount || 0;

  const totalEntries =
    totalCount < pageSize * currentPage ? totalCount : pageSize * currentPage;
  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    // Format time string to HH:mm
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };
  let data: any = {
    pageNo: currentPage,
    pageSize: pageSize,
    searchValue: searchQuery ?? '',
  };
  const calculateTotalUpworkHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalUpworkHours,
      0
    );
  };

  const calculateTotalFixedHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalFixedHours,
      0
    );
  };
  const calculateTotalOfflineHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalOfflineHours,
      0
    );
  };
  const calculateTotalBillingHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalBillingHours,
      0
    );
  };
  const totalUpworkHours = numberToTimeConversion(
    calculateTotalUpworkHours(developersReports)
  );
  const totalOfflineHours = numberToTimeConversion(
    calculateTotalOfflineHours(developersReports)
  );
  const totalFixedHours = numberToTimeConversion(
    calculateTotalFixedHours(developersReports)
  );
  const totalBillingHours = numberToTimeConversion(
    calculateTotalBillingHours(developersReports)
  );
  const handleEntries = (e: any) => {
    const showValue = e.target.value;

    router.push(
      `${url}?tab=${activeTab}&hoursFrom=${hoursFrom}&hoursTo=${hoursTo}&pageNumber=${1}&pageSize=${showValue}&search=${searchQuery}`
    );
  };
  const handleSearch = (e: any) => {
    const search = e.target.value;
    router.push(
      `${url}?tab=${activeTab}&hoursFrom=${hoursFrom}&hoursTo=${hoursTo}&pageNumber=${1}&pageSize=${pageSize}&search=${search}`
    );
  };
  return (
    <>
      <div id='DeveloperReport' role='tabpanel'>
        <div className='card custom-card team_card'>
          <div className='card-header justify-content-between awards_card_header'>
            <div className='card-title'>Developer Productivity Report</div>
            <div className='filter-right d-flex gap-x-2'>
              <DateFilter />
            </div>
          </div>
          <div className='card-body'>
            <div className='table-responsive theme_table'>
              <div className='d-flex flex-wrap justify-content-between dataTable_filterBox'>
                <div className='d-flex gap-x-2 align-items-center mb-4'>
                  Show
                  <select className='form-control w70' onChange={handleEntries}>
                    <option value='10'>10</option>
                    <option value='25'>25</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                    <option value='200'>200</option>
                  </select>
                  entries
                </div>
                <div className='search_box mb-4'>
                  <i className='ri-search-line'></i>
                  <input
                    className='form-control'
                    type='text'
                    placeholder='Search Here'
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className='table-responsive theme_table'>
                <table className='table text-nowrap table-hover border table-bordered'>
                  <thead>
                    <tr>
                      <th scope='col'>Developer Name</th>
                      <th scope='col'>Upwork Hours</th>
                      <th scope='col'>Fixed Billing Hours</th>
                      <th scope='col'>Billing Hours</th>
                      <th scope='col'>Non Billable Hours</th>
                      <th scope='col'>Worked on Projects</th>
                      <th scope='col'>Details</th>
                    </tr>
                  </thead>
                  {developersReports != undefined && (
                    <tbody>
                      {developersReports?.results.map(
                        (item: any, index: any) => (
                          <tr key={index}>
                            <Link
                              href={`/employees/${item.employeeID}`}
                              className='btn btn-link text-primary'
                            >
                              {item.fullName}
                            </Link>

                            <td>
                              {numberToTimeConversion(item.totalUpworkHours)}
                            </td>
                            <td>
                              {numberToTimeConversion(item.totalFixedHours)}
                            </td>
                            <td className='text-success text-bold'>
                              <b>
                                {numberToTimeConversion(item.totalBillingHours)}
                              </b>
                            </td>
                            <td className='text-danger'>
                              {numberToTimeConversion(item.totalOfflineHours)}
                            </td>
                            <td className='worked_status'>
                              {item.projectNames}
                            </td>
                            <td>
                              {/* <button
                                                            aria-label='anchor'
                                                            className='btn-sm-badge btn btn-icon btn-wave waves-effect waves-light btn-sm btn-primary-light btn-badge-text'
                                                            data-bs-target='#ProgressReport'
                                                            data-bs-toggle='modal'
                                                        >
                                                            View
                                                        </button> */}
                              <ReportDetailsButton
                                employeeId={item.employeeId}
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  )}
                  {developersReports != undefined && (
                    <tfoot>
                      <tr>
                        <td className='text-bold'>Total </td>
                        <td>{totalUpworkHours}</td>
                        <td>{totalFixedHours}</td>
                        <td className='text-success text-bold'>
                          {totalBillingHours}
                        </td>
                        <td className='text-danger'>{totalOfflineHours}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
                {developersReports == undefined && <p>No record found</p>}
              </div>
            </div>
          </div>
          <div className='card-footer'>
            <div className='d-flex align-items-center pagination_layout'>
              <div>
                Total Showing Entries {totalEntries} out of {totalCount ?? 0}
                <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
              </div>

              <div className='ms-auto'>
                <nav>
                  <ReportPagination
                    totalRecords={developersReports?.totalCount}
                    data={data}
                  />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DeveloperReport;
