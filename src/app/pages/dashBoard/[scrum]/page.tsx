import React from 'react';
import SideNav from '@/components/common/SideBar/sidebar';
import Footer from '@/components/common/Footer/footer';
import Header from '@/components/common/Header/header';
import { AttendanceListModel, EmployeeProfileDetailsResponse, EmpProfileReqParams, ScrumPayLoadModel, ScrumTeamPerFormanceResponseModel, ScrumTeamProjectsResponseModel, ScrumTeamStatusResponseModel } from '@/utils/types';
import { attendanceListFromDB, EmpProfileDetailsById, scrumTeamAttendance, scrumTeamPerformance, scrumTeamProjects, scrumTeamStatus } from '@/utils/publicApi';
import ScrumTeamStatus from '@/components/scrum/teamStatus';
import { format } from 'date-fns';
import ProgressDetails from '@/components/scrum/progressDetails';
import ModuleDetailsButton from '@/components/scrum/ModuleDetailsButton';
import ScrumDateFilter from '@/components/dashboard/scrumDateFilter';

// import Link from 'next/link';
 import getUser from '@/utils/getUserServerSide';
import ScrumTeamDetails from '@/components/scrum/teamDetails';
import Link from 'next/link';
import ScrumMonthFilter from '@/components/dashboard/scrumMonthFilter';


const Projects = async({params,searchParams}:any) => {
     const user: any = getUser();
let employeeData:EmployeeProfileDetailsResponse={
    name: undefined,
    userTools: undefined,
    userBadges: undefined,
    employeeID: '',
    firstName: undefined,
    lastName: undefined,
    designation: null,
    profileImage: '',
    departmentId: '',
    department: '',
    email: 0,
    phoneNumber: null,
    empStatus: 0,
    joiningDate: null,
    experience: null,
    teamAdminId: '',
    manager: '',
    address: '',
    skills: '',
    employeeNumber: '',
    canEditStatus: false,
    projects: [],
    awardList: [],
    feedbackDetails: []
};
 let today = new Date();

let startDate = searchParams.startDate ?? new Date(today.getFullYear(), today.getMonth(), 1);
let endDate = searchParams.endDate ?? new Date(today.getFullYear(), today.getMonth() + 1, 0);

startDate = format(startDate, 'yyyy-MM-dd');
endDate = format(endDate, 'yyyy-MM-dd');


const date = new Date();
let year = date.getFullYear();
let month = String(date.getMonth() + 1).padStart(2, '0');
const selectedMonth = searchParams.month ?? `${year}-${month}`;
[year, month] = selectedMonth.split('-');


 const selectedDate = searchParams.date ?? format(new Date(), 'yyyy-MM-dd');
 let teamPerformance:ScrumTeamPerFormanceResponseModel[]=[];
 let teamProjects:ScrumTeamProjectsResponseModel[]=[];
 let teamStatus:ScrumTeamStatusResponseModel[]=[];
 let attendanceList:AttendanceListModel[]=[];
 let teamMonthlyAttendance:any[]=[];
 
let payLoad:ScrumPayLoadModel={
    startDate:startDate,
    endDate:endDate,
    teamLeadId:params.scrum,
    filterByDate:selectedDate,
    month: Number(month),
    year: Number(year),
    selectedMonth:selectedMonth
}

    try {
        teamPerformance= await scrumTeamPerformance(payLoad);
    } catch (error) {}

    try {
        teamProjects= await scrumTeamProjects(payLoad);
    } catch (error) {}

    try {
        teamStatus= await scrumTeamStatus(payLoad);
    } catch (error) {}

    try {
        attendanceList= await attendanceListFromDB();

    } catch (error) {}

    try {
        teamMonthlyAttendance = await scrumTeamAttendance(payLoad);
      } catch (error) {}

    try {
        
    } catch (error) {
        
    }

    try {
        let reqParams: EmpProfileReqParams = {
            departmentID: user.departmentId,
            employeeId: params.scrum,
          };
        
          employeeData = await EmpProfileDetailsById(reqParams);
    } catch (error) {}
   

    

    const numberToTimeConversion = (decimalTime: any) => {
        const hours = Math.floor(decimalTime);
        const fractionalHours = decimalTime - hours;
        const minutes = Math.round(fractionalHours * 60);
    
        // Format time string to HH:mm
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formattedTime;
      };
   

      const totalOfProjectsUpworkHours=()=>{
        return numberToTimeConversion(
            teamProjects
              .map((item: ScrumTeamProjectsResponseModel) => item.upworkHours)
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

      const totalOfProjectsFixedHours=()=>{
        return numberToTimeConversion(
            teamProjects
              .map((item:ScrumTeamProjectsResponseModel) => item.fixedHours)
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

      const totalOfProjectsBilledHours=()=>{
        return numberToTimeConversion(
            teamProjects
              .map((item:ScrumTeamProjectsResponseModel) =>(item.upworkHours + item.fixedHours))
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

      const totalOfProjectsNonBilledHours=()=>{
        return numberToTimeConversion(
            teamProjects
              .map((item:ScrumTeamProjectsResponseModel) =>item.nonBillableHours)
              .reduce((a: number, b: number) => a + b, 0)
          );
      };
     
    return (
        <>
            {/* <!-- PAGE --> */}
            <div className='app sidebar-mini ltr light-mode'>
                <div className='page'>
                    {/* <!-- app-Header --> */}
                    <Header />
                    {/* <!--APP-SIDEBAR--> */}
                    <SideNav />
                    {/* <!--app-content open--> */}
                    <div className='main-content app-content mt-0'>
                        <div className='side-app'>
                            {/* <!-- CONTAINER --> */}
                            <div className="main-container container-fluid profile-page">

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="card custom-card">
                                    <div className="card-header justify-content-between items-center">
                                        <div className="card-title">Project Detail</div>
                                        <div className="filter-right d-flex gap-x-2">
                                        <ScrumDateFilter  data={payLoad}/>
                                         
                                        </div>
                                    </div>
                                    <div className="card-body ">
                                        <div className="table-responsive theme_table">
                                            <table className="table text-nowrap table-hover border table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className="project-width">Project Name</th>
                                                    <th scope="col">Client Name</th>
                                                    <th scope="col">Upwork Hours</th>
                                                    <th scope="col">Fixed Billing Hours</th>                                                    
                                                    <th scope="col">Billed Hours</th>
                                                    <th scope="col">Non Billable Hours</th>
                                                    <th scope="col">Details</th>
                                                    <th scope="col">Module Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {teamProjects?.map((project:ScrumTeamProjectsResponseModel)=>(
                                                    <tr key={project.projectId}>
                                                    <td><Link href={`/projects/${project.projectId}`}>{project.projectName}</Link></td>
                                                    <td>{project.clientName}</td>
                                                    <td>{numberToTimeConversion(project.upworkHours)}</td>
                                                    <td>{numberToTimeConversion(project.fixedHours)}</td>
                                                    <td className="text-success text-bold"><b>{numberToTimeConversion(project.upworkHours + project.fixedHours)}</b></td>
                                                    <td className="text-danger">{numberToTimeConversion(project.nonBillableHours)}</td>
                                                    <td>
                                                        <ProgressDetails  id={project.projectId} payLoad={payLoad} />
                                                        </td>
                                                    <td>
                                                        <ModuleDetailsButton id={project.projectId} payLoad={payLoad}/>
                                                         </td>
                                                </tr>
                                                ))}
                                             
                                             </tbody>
                                            {teamProjects?.length >0 && (<tfoot>
                                                <tr>
                                                   <td className="text-bold">Total </td>
                                                   <td></td>
                                                   <td>{totalOfProjectsUpworkHours()}</td>
                                                   <td>{totalOfProjectsFixedHours()}</td>
                                                   <td className="text-success text-bold"><b>{totalOfProjectsBilledHours()}</b></td>
                                                   <td className="text-danger">{totalOfProjectsNonBilledHours()}</td>
                                                   <td></td>
                                                   <td></td>
                                                </tr>
                                             </tfoot>)}
                                            </table>
                                            {teamProjects?.length == 0 && <p>No record found.</p>}
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex align-items-center">
                                            <div> Showing {teamProjects?.length} Entries <i className="bi bi-arrow-right ms-2 fw-semibold"></i>
                                            </div>
                                            <div className="ms-auto">
                                                {/* <nav aria-label="Page navigation" className="pagination-style-4">
                                                    <ul className="pagination mb-0">
                                                        <li className="page-item disabled"><a className="page-link" href="javascript:void(0);"> Prev </a></li>
                                                        <li className="page-item active"><a className="page-link" href="javascript:void(0);">1</a></li>
                                                        <li className="page-item"><a className="page-link" href="javascript:void(0);">2</a></li>
                                                        <li className="page-item"><a className="page-link text-primary" href="javascript:void(0);"> next </a></li>
                                                    </ul>
                                                </nav> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                       <ScrumTeamDetails teamPerformance={teamPerformance}  payLoad={payLoad} employeeDetails={employeeData}/>

                       <div className='row'>
                    <div className='col-sm-12'>
                      <div className='card custom-card team_card'>
                        <div className='card-header justify-content-between awards_card_header'>
                          <div className='card-title'>
                            Attendance 
                          </div>
                          <div className="filter-right d-flex gap-x-2">
                          <ScrumMonthFilter month={selectedMonth} payLoad={payLoad}/>  
                                        </div>
                         
                        </div>
                        <div className='card-body'>
                          <div className='table-responsive attendance_table'>
                            <table className='border-primary hours-table table table-bordered text-nowrap attendance_layout'>
                              <thead>
                                <tr>
                                  <th scope='col'>Name</th>
                                  {teamMonthlyAttendance &&
                                    teamMonthlyAttendance[0]?.employeeAttendance.map(
                                      (data: any) => (
                                        <th scope='col' key={data.day}>
                                          {data.day}
                                        </th>
                                      )
                                    )}
                                </tr>
                              </thead>
                              <tbody>
                                {teamMonthlyAttendance &&
                                  teamMonthlyAttendance.map((item: any) => (
                                    <tr key={item.employeeName}>
                                      <th>{item.employeeName}</th>
                                      {item?.employeeAttendance?.map(
                                        (employeeDetail: any) => (
                                          <td
                                            className={
                                              employeeDetail.attendanceStatus
                                            }
                                            key={employeeDetail.day}
                                          >
                                            {employeeDetail.attendanceStatus ===
                                            'H' ? (
                                              <div className='attendance_status_info'>
                                                <div className='attendance_status Present_status'>
                                                  {
                                                    employeeDetail.attendanceStatus
                                                  }
                                                </div>
                                              </div>
                                            ) : (
                                              <div className='attendance_status_info'>
                                                <div
                                                  className={`attendance_status Present_status ${employeeDetail.attendanceStatus === 'Ab' ? 'red' : ''}`}
                                                >
                                                  {
                                                    employeeDetail.attendanceStatus
                                                  }
                                                </div>

                                                <div className='_BM_attendance'>
                                                  <div className='attendance_status_3t'>
                                                    <span className='threeT_info'>
                                                      3t
                                                    </span>
                                                    <span className='threeT__attendance'>
                                                      {
                                                        employeeDetail.attendanceStatus
                                                      }
                                                    </span>
                                                    <span className='threeT-time'>
                                                      {employeeDetail.dayHours}
                                                    </span>
                                                  </div>
                                                  <div className='attendance_status_bm bg-white'>
                                                    <span className='BM_info'>
                                                      BM
                                                    </span>
                                                    <span className='BM__attendance bg-white'>
                                                      N/A
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </td>
                                        )
                                      )}
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                       <ScrumTeamStatus teamStatus={teamStatus} attendanceList={attendanceList} payLoad={payLoad}/>

                    
                      </div>
                        
                        
                        </div>
                      
                    </div>
                </div>

           
                <Footer />
            </div>
        </>
    );
};

export default Projects;