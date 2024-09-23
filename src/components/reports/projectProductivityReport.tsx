'use client';
import DateFilter from './projectReportDateFilter';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ReportPagination from './pagination';
import Link from 'next/link';
const ProjectReport = ({ projectsReports,  endDate }: any) => {
  //Initialize hook
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = usePathname();

  //Get Params
  const activeTab = searchParams?.get('tab');
  const projectStartDate: any = searchParams?.get('projectStartDate');
  const hoursFrom: any = searchParams?.get('hoursFrom');
  const hoursTo: any = searchParams?.get('hoursTo');
  const currentPage: any = searchParams?.get('pageNumber') ?? 1;
  const pageSize: any = searchParams?.get('pageSize') ?? 10;
  const searchQuery = searchParams?.get('search') ?? '';

  // Paging default Value Calculation
  const totalCount = projectsReports?.totalCount || 0;
  const totalEntries =
    totalCount < pageSize * currentPage ? totalCount : pageSize * currentPage;

  let data: any = {
    pageNo: currentPage,
    pageSize: pageSize,
    searchValue: searchQuery ?? '',
  };
  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    // Format time string to HH:mm
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };
  const calculateTotalUpworkHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalUpworkHours,
      0
    );
  };
  const calculateTotalOfflineHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalOfflineHours,
      0
    );
  };
  const calculateTotalFixedHours = (data: any) => {
    return data?.results.reduce(
      (total: any, item: any) => total + item.totalFixedHours,
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
    calculateTotalUpworkHours(projectsReports)
  );
  const totalOfflineHours = numberToTimeConversion(
    calculateTotalOfflineHours(projectsReports)
  );
  const totalFixedHours = numberToTimeConversion(
    calculateTotalFixedHours(projectsReports)
  );
  const totalBillingHours = numberToTimeConversion(
    calculateTotalBillingHours(projectsReports)
  );
  const handleEntries = (e: any) => {
    const showValue = e.target.value;
    router.push(
      `${url}?tab=${activeTab}&projectStartDate=${projectStartDate}&hoursFrom=${hoursFrom}&hoursTo=${hoursTo}&pageNumber=${1}&pageSize=${showValue}&search=${searchQuery}`
    );
  };
  const handleSearch = (e: any) => {
    const search = e.target.value;
    router.push(
      `${url}?tab=${activeTab}&projectStartDate=${projectStartDate}&hoursFrom=${hoursFrom}&hoursTo=${hoursTo}&pageNumber=${1}&pageSize=${pageSize}&search=${search}`
    );
  };
  return (
    <>
      <div id='ProjectReport' role='tabpanel'>
        <div className='card custom-card team_card'>
          <div className='card-header justify-content-between awards_card_header'>
            <div className='card-title'>Project Productivity Report</div>
            <div className='filter-right d-flex gap-x-2'>
              <DateFilter endDate={endDate} />
            </div>
          </div>
          <div className='card-body'>
            <div>
              <div className='d-flex flex-wrap justify-content-between dataTable_filterBox'>
                <div className='d-flex gap-x-2 align-items-center mb-4'>
                  Show
                  <select className='form-control w70' onChange={handleEntries}>
                    <option value='10'>10</option>
                    <option value='25'>25</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                    <option value='200'>200</option>
                  </select>{' '}
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
                      <th scope='col' className='project-width'>
                        Project Name
                      </th>
                      <th scope='col' className='module-width'>
                        Module
                      </th>
                      <th scope='col'>Client Name</th>
                      <th scope='col'>Upwork Hours</th>
                      <th scope='col'>Fixed Billing Hours</th>
                      <th scope='col'>Billing Hours</th>
                      <th scope='col'>Non Billable Hours</th>
                    </tr>
                  </thead>
                  {projectsReports != undefined && (
                    <tbody>
                      {projectsReports?.results.map((item: any, index: any) => (
                        <tr key={index}>
                          <Link href={`/projects/${item.projectId}`} className="btn-link" >
                          {item.projectName}    </Link>
                          {/* <td>{item.projectName}</td> */}
                          <td>{item.projectName}</td>
                          <td>{item.clientName}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  )}
                  {projectsReports != undefined && (
                    <tfoot>
                      <tr>
                        <td className='text-bold'>Total </td>
                        <td></td>
                        <td></td>
                        <td>{totalUpworkHours}</td>
                        <td>{totalFixedHours}</td>
                        <td className='text-success text-bold'>
                          <b>{totalBillingHours}</b>
                        </td>
                        <td className='text-danger'>{totalOfflineHours}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
                {projectsReports == undefined && <p>No record found</p>}
              </div>
            </div>
          </div>
          <div className='card-footer'>
            <div className='d-flex align-items-center pagination_layout'>
              <div>
                Total Showing Entries {totalEntries} out of{' '}
                {projectsReports?.totalCount ?? 0}
                <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
              </div>

              <div className='ms-auto'>
                <nav>
                  <ReportPagination
                    totalRecords={projectsReports?.totalCount}
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
export default ProjectReport;
