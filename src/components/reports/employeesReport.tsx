'use client';
import Image from 'next/image';
import ReportPagination from './pagination';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import EmployeeExcel from './employeesReportExcel';
import { format } from 'date-fns';

const EmployeesReport = ({ employeesReport }: any) => {
    //Initialize hook
    const router = useRouter();
    const searchParams = useSearchParams();
    const url = usePathname();

    // const numberToTimeConversion = (decimalTime: any) => {
    //     const hours = Math.floor(decimalTime);
    //     const fractionalHours = decimalTime - hours;
    //     const minutes = Math.round(fractionalHours * 60);

    //     // Format time string to HH:mm
    //     const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    //     return formattedTime;
    // };

    //Get Params
    const activeTab = searchParams?.get('tab');
    const projectStartDate: any = searchParams?.get('projectStartDate');
    const hoursFrom: any = searchParams?.get('hoursFrom');
    const hoursTo: any = searchParams?.get('hoursTo');

    const pageSize: any = searchParams?.get('pageSize') ?? 10;
    const searchQuery = searchParams?.get('search') ?? '';
    const currentPage: any = searchParams?.get('pageNumber') ?? 1;

    let data: any = {
        pageNo: currentPage,
        pageSize: pageSize,
        searchValue: searchQuery ?? '',
    };
    const totalCount = employeesReport?.totalCount || 0;

    const totalEntries =
        totalCount < pageSize * currentPage
            ? totalCount
            : pageSize * currentPage;
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
            <div id="EmployeesReport" role="tabpanel">
                <div className="card custom-card team_card">
                    <div className="card-header justify-content-between awards_card_header">
                        <div className="card-title">
                            Employees Profile Report
                        </div>
                        <div className="filter-right d-flex gap-x-2">
                            <div className="btn-list mt-md-0 mt-2">
                                <EmployeeExcel />
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive theme_table">
                            <div className="d-flex flex-wrap justify-content-between dataTable_filterBox">
                                <div className="d-flex gap-x-2 align-items-center mb-4">
                                    Show
                                    <select
                                        className="form-control w70"
                                        onClick={handleEntries}
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="200">200</option>
                                    </select>
                                    entries
                                </div>
                                <div className="search_box mb-4">
                                    <i className="ri-search-line"></i>
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Search Here"
                                        onChange={handleSearch}
                                    />
                                </div>
                            </div>
                            <table className="table text-nowrap table-hover border table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Designation</th>
                                        <th scope="col">Joining Date</th>
                                        <th scope="col">Skills</th>
                                        <th scope="col">Skype Id</th>
                                        <th scope="col">Worked on Projects</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeesReport?.results.map(
                                        (item: any, index: any) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="d-flex align-items-center fw-semibold">
                                                        <span className="avatar avatar-sm me-2 avatar-rounded">
                                                            <Image
                                                                src={`https://3t-api.csdevhub.com/images/${item?.profileImage}`}
                                                                alt="img"
                                                                height={20}
                                                                width={20}
                                                            />
                                                        </span>
                                                        {item?.userName}
                                                    </div>
                                                </td>
                                                <td>{item?.designation}</td>
                                                <td>{format(item?.joiningDate, 'yyyy-MM-dd')}</td>
                                                <td>{item?.skills}</td>
                                                <td>{item?.skypeMail}</td>
                                                <td>{item?.projectNames}</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex align-items-center pagination_layout">
                            <div>
                                Total Showing Entries {totalEntries} out of{' '}
                                {totalCount ?? 0}
                                <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                            </div>

                            <div className="ms-auto">
                                <nav>
                                    <ReportPagination
                                        totalRecords={
                                            employeesReport?.totalCount
                                        }
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
export default EmployeesReport;
