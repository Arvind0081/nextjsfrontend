// app/manager/employee/page.tsx
import DeleteButton from '@/components/common/Delete/delete';
import {
  allDesignations,
  employeeStatus,
  employeesById,
  getEmployeeStatus,
  newMemberRequestList,
} from '@/utils/publicApi';
import SearchInput from '@/components/common/Search/search';
import {
  DesignationsParam,
  EmpReqParams,
  // GetAllEmpParamsModel,
  newRequestModel,
} from '@/utils/types';
import Paginator from '@/components/employees/pagination';
import Designation from '@/components/employees/designation';
import EmployeeStatus from '@/components/employees/employeeStatus';
import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
import getUser from '@/utils/getUserServerSide';
import Link from 'next/link';
import Image from 'next/image';
import UpdateEmployeeStatus from '@/components/employees/updateEmployeeStatus';
import Footer from '@/components/common/Footer/footer';
import ActionButtons from '@/components/employees/actionButtons';
import RemoveFromItem from '@/components/employees/removeFromItem';


const EmployeeComponent = async ({ searchParams }: any) => {
 
  let user: any = getUser();
  let searchQuery = searchParams?.searchValue ?? '';
  const selectedDesignation = searchParams?.designation ?? '';
  const selectedEmpStatus = searchParams?.empStatus ?? 1;

  let pageSize = searchParams?.size ?? 10;
  let currentPage = searchParams?.page ?? 1;
  let teamAdminId:string= searchParams.teamAdminId ?? '';
  const empStatusList = await employeeStatus();
  const empStatus = await getEmployeeStatus();

  let newRequest: newRequestModel[] = [];
  // let data: GetAllEmpParamsModel = {
  //   pageNo: currentPage,
  //   pageSize: pageSize,
  //   searchValue: searchQuery,
  //   projectStatus: 0,
  //   employeeStatus: selectedEmpStatus,
  //   teamAdminId: teamAdminId
  // };

  let reqParams: EmpReqParams = {
    departmentID: user?.departmentId ?? 0,
    searchValue: searchQuery,
    pageSize: pageSize,
    pagenumber: currentPage,
    employeeStatus: selectedEmpStatus,
    designation: selectedDesignation,
    isActive: selectedEmpStatus,
    TeamAdminId: teamAdminId,
    
  
  };

  let initialEmployees = await employeesById(reqParams);
  

  const totalCount = initialEmployees?.model?.totalCount || 0;
  const totalEntries =
    totalCount < pageSize * currentPage ? totalCount : pageSize * currentPage;

    const params: DesignationsParam = {
      departmentID:user.departmentId
    };
  

  const designations = await allDesignations(params);

  try {
    const { results } = await newMemberRequestList();
    newRequest = results;
  } catch (error) {}

  return (
    <div className='app sidebar-mini ltr light-mode'>
      <div className='page'>
        <div className='page-main'>
          <Header />
          <SideNav />
          <div className='main-content app-content mt-0'>
            <div className='side-app'>
              <div className='main-container container-fluid'>
                <div className='row'>
                  
                  <div className='col-xl-9'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>Team Members</div>
                        <div className='filter-right d-flex gap-x-2'>
                          <div className='selectbox select_designation'>
                            <Designation desg={designations} payload={reqParams} />
                          </div>

                          <div className='selectbox'>
                            <EmployeeStatus empStatusList={empStatusList}  payload={reqParams} />
                          </div>

                          <div className='search_box'>
                            <i className='ri-search-line' />
                            <SearchInput payload={reqParams} />
                          </div>
                        </div>
                      </div>
                      <div className='card-body'>
                        <div className='table-responsive theme_table'>
                          <table className='table text-nowrap table-hover border table-bordered'>
                            <thead>
                              <tr>
                                
                                <th scope='col'>User Name</th>
                                <th scope='col' className='designation-width'>
                                  Designation
                                </th>
                                <th scope='col'>Department</th>
                                <th scope='col'>Email</th>
                                <th scope='col' className='w200'>
                                  Employee Status
                                </th>
                                <th scope='col'>Action</th>
                              </tr>
                            </thead>
                            {initialEmployees?.model?.results ? (
                              <tbody>
                                {initialEmployees.model.results.map(
                                  (emp: any) => (
                                    <tr key={emp.employeeID}>
                                      <td>
                                        <span className='avatar avatar-sm me-2 avatar-rounded'>
                                          {emp.employeeUserName
                                            ?.split(' ')
                                            .map((name: any) =>
                                              name[0]?.toUpperCase()
                                            )
                                            .join('')}
                                        </span>
                                        <Link
                                          href={`/employees/${emp.employeeID}`}
                                          className='btn btn-link text-primary'
                                        >
                                          {emp.employeeUserName}
                                        </Link>
                                      </td>
                                      <td>{emp.designation}</td>
                                      <td>{emp.department}</td>
                                      <td>{emp.email}</td>
                                      <td>
                                        <UpdateEmployeeStatus
                                          emp={emp}
                                          empStatus={empStatus}
                                        />
                                      </td>
                                      <td>
                                      <RemoveFromItem id={emp.employeeID} />&nbsp;&nbsp;
                                        <DeleteButton id={emp.employeeID} />
                                       
                                      </td>
                                      
                                    </tr>
                                  )
                                )}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td className='text-center'>
                                    No record found.
                                  </td>
                                </tr>
                              </tbody>
                            )}
                          </table>
                          <div className='card-footer'>
                            <div className='d-flex align-items-center'>
                              Total Showing Entries {totalEntries} out of{' '}
                              {initialEmployees?.model?.totalCount ?? 0}
                              <Paginator
                                totalRecords={
                                  initialEmployees?.model?.totalCount
                                }
                                payload={reqParams}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>
                        New Member Requests.
                        </div>
                      </div>
                      <div className='card-body'>
                        <div className='table-responsive theme_table'>
                          <table className='table text-nowrap table-hover  '>
                            <thead>
                              <tr>
                                {/* <th scope='col'>User Name</th> */}
                                {/* <th scope='col'>Designation</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>Action</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {newRequest.length > 0 &&
                                newRequest.map((item: newRequestModel) => (
                                  <tr key={item.employeeID}>
                                    <td>
                                      <div className='d-flex align-items-center fw-semibold user-with-img'>
                                        <span className='avatar avatar-sm me-2 avatar-rounded'>
                                          {item.profileImage ? (
                                            <Image
                                              src={`https://3t-api.csdevhub.com/images/${item.profileImage}`}
                                              alt='img'
                                              height={50}
                                              width={50}
                                            />
                                          ) : (
                                            item.employeeUserName
                                              .split(' ')
                                              .map((name: any) =>
                                                name[0]?.toUpperCase()
                                              )
                                              .join('')
                                          )}
                                        </span>
                                        {item.employeeUserName}
                                      </div>
                                    </td>
                                    {/* <td>{item.designation}</td>
                                    <td className='text-nowrap'>
                                      {item.email}
                                    </td> */}
                                    <td>
                                      <ActionButtons id={item.employeeID} />
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {newRequest.length == 0 && (
                            <span>No Record Found.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeeComponent;