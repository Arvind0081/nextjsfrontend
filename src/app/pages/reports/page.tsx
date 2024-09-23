import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
// import NotFound from '@/app/not-found';
import {
  hrReports,
  projectsReport,
  developersReport,
  teamReport,
  employeesAttendanceReport,
  paymentPendingReport,
  projectModulesStatus,
  projectPaymentStatus,
  clientReport,
  workInHand,
  fullReport,
  settingsEmployeeList,
  projectDetail,
  getCLients,
} from '@/utils/publicApi';
import {
  AttendenceFormValue,
  ProjectsReport,
  DevelopersReport,
  TeamsReport,
  EmployeesAttendanceReport,
  PaymentPendingReport,
  ClientReportReq,
  WorkInHandReq,
  FullReportByManagerReq,
  SettingEmpReqParams,
} from '@/utils/types';
import getUser from '@/utils/getUserServerSide';
import SelectTabs from '@/components/reports/selectTabs';
import AttendanceReport from '@/components/reports/attendanceReport';
import ProjectReport from '@/components/reports/projectProductivityReport';
import DeveloperReport from '@/components/reports/developerProductivityReport';
import { format } from 'date-fns';
import TeamReport from '@/components/reports/teamProductivityReport';
import EmployeesReport from '@/components/reports/employeesReport';
import PaymentPending from '@/components/reports/paymentPending';
import ClientReport from '@/components/reports/clientReport';
import WorkInHand from '@/components/reports/workInHand';
import FullReport from '@/components/reports/fullReport';

const Reports = async ({ searchParams }: any) => {
  let user: any = getUser();
  let today = new Date();
  let startDateFrom = format(
    new Date(today.setDate(today.getDate() - 6)),
    'yyyy-MM-dd'
  );
  let endDateTo = format(new Date(), 'yyyy-MM-dd');

  // Filter Params
  let startDate = searchParams.startDate;
  let endDate = searchParams.endDate;
  let projectStartDate: any =
    searchParams?.projectStartDate != 'null'
      ? searchParams?.projectStartDate
      : startDateFrom;
  let fromDate: any =
    searchParams?.hoursFrom != 'null' ? searchParams?.hoursFrom : startDateFrom;
  let toDate: any =
    searchParams?.hoursTo != 'null' ? searchParams?.hoursTo : endDateTo;

  let emp: any = searchParams?.EmployeeId;
  let projectID: any = searchParams?.ProjectId;

  let dateStr = searchParams?.month;
  let activeTab = searchParams?.tab ?? 'Attendance Report';
  let teamAdminId = searchParams?.teamAdminId;
  let hrReportList: any;
  let projectsReports: any;
  let developersReports: any;
  let teamsReport: any;
  let empsReport: any;
  let paymentPendingReports: any;
  let projectModuleStatus: any;
  let projectPaymentsStatus: any;
  let clientReportResonse: any;
  let workInHandRes: any;
  let fullReportRes: any;
  let employeeList: any;
  let projects: any;
  let clients: any;

  //Paging Params
  const pageNumber = searchParams?.pageNumber ?? 1;
  const pageSize = searchParams?.pageSize ?? 10;
  const searchQuery = searchParams?.search ?? '';
  const clientID = searchParams?.ClientId ?? 0;

  if (dateStr == undefined) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    dateStr = `${year}-${month}`;
  }
  let [year, month] = dateStr.split('-');

  const attendence: AttendenceFormValue = {
    DepartmentId: user?.departmentId,
    Month: startDate ?? month,
    Year: endDate ?? year,
    PageNumber: pageNumber,
    PageSize: pageSize,
    SearchValue: '',
    designations: '',
    IsActive: 0,
    TeamAdminId: teamAdminId ?? '',
  };
  try {
    hrReportList = await hrReports(attendence);
  } catch (error) {}

  const projectReq: ProjectsReport = {
    PageNumber: Number(pageNumber),
    PageSize:Number(pageSize) ,
    StartDate: projectStartDate ?? '',
    HoursFrom: fromDate ?? '',
    HoursTo: toDate ?? '',
    DepartmentId: Number(user.departmentId),
    SearchValue: searchQuery ?? '',
    TeamAdminId: teamAdminId ?? '',
  };

  try {
    projectsReports = await projectsReport(projectReq);
  } catch (error) {}

  const developersReportReq: DevelopersReport = {
    From: fromDate ?? '',
    To: toDate ?? '',
    PageNumber: pageNumber,
    PageSize: pageSize,
    DepartmentId: 0,
    SearchValue: searchQuery ?? '',
    TeamAdminId: teamAdminId ?? '',
  };
  try {
    developersReports = await developersReport(developersReportReq);
  } catch (error) {}

  const teamReportReq: TeamsReport = {
    From: fromDate ?? '',
    To: toDate ?? '',
    DepartmentId: 0,
    SearchValue: searchQuery ?? '',
    TeamAdminId: teamAdminId ?? '',
  };
  try {
    teamsReport = await teamReport(teamReportReq);
  } catch (error) {}

  const empReportReq: EmployeesAttendanceReport = {
    PageNumber: pageNumber,
    PageSize: pageSize,
    DepartmentId: 0,
    SearchValue: searchQuery ?? '',
    TeamAdminId: teamAdminId ?? '',
  };
  try {
    empsReport = await employeesAttendanceReport(empReportReq);
  } catch (error) {}

  
  const paymentPendingReportReq: PaymentPendingReport = {
    teamAdminId: teamAdminId ?? '',
    departmentId: 0,
    searchText: searchQuery ?? '',
  };
  try {
    paymentPendingReports = await paymentPendingReport(paymentPendingReportReq);
  } catch (error) {}

  //ProjectModuleStatus  API Call
  try {
    projectModuleStatus = await projectModulesStatus();
  } catch (error) {}

  //ProjectPaymentStatus API Call
  try {
    projectPaymentsStatus = await projectPaymentStatus();
  } catch (error) {}

  //ClientReport API Call
  const clientReportReq: ClientReportReq = {
    FromDate: fromDate ?? '',
    ToDate: toDate ?? '',
    DepartmentId: 0,
    TeamAdminId: teamAdminId ?? '',
  };
  try {
    clientReportResonse = await clientReport(clientReportReq);
  } catch (error) {}

  //Work In Hand API Call
  const workInHandReq: WorkInHandReq = {
    SearchText: searchQuery ?? '',
    DepartmentId: 0,
    TeamAdminId: teamAdminId ?? '',
  };
  try {
    workInHandRes = await workInHand(workInHandReq);
  } catch (error) {}

  //Full Report API Call
  const fullReportReq: FullReportByManagerReq = {
    EmployeeId: emp ?? '',
    DepartmentId: 0,
    TeamAdminId: teamAdminId ?? '',
    ProjectId: projectID ?? 0,
    ClientId: clientID ?? 0,
    FromDate: fromDate != undefined ? fromDate : startDateFrom,
    ToDate: toDate != undefined ? toDate : endDateTo,
  };
  try {
    fullReportRes = await fullReport(fullReportReq);
  } catch (error) {}

  let reqParams: SettingEmpReqParams = {
    departmentID: user.departmentId,
    teamAdminId: teamAdminId ?? '',
  };
  try {
    employeeList = await settingsEmployeeList(reqParams);
  } catch (error) {}

  try {
    projects = await projectDetail();
  } catch (error) {}

  try {
    clients = await getCLients();
  } catch (error) {}

  return (
    <>
      <div className='app sidebar-mini ltr light-mode'>
        <div className='page'>
          <div className='page-main'>
            <Header />
            <SideNav />
            <div className='main-content app-content mt-0'>
              <div className='side-app'>
                <div className='main-container container-fluid'>
                  <div className='row'>
                    <div className='col-xl-12'>
                      <div className='card custom-card'>
                        <div className='card-body'>
                          <SelectTabs activeTabName={activeTab} />
                        </div>
                      </div>

                      <div className='custm-tabs'>
                        <div className='tab-content'>
                          {activeTab == 'Attendance Report' && (
                            <AttendanceReport hrReportList={hrReportList} />
                          )}
                          {activeTab == 'Project Report' && (
                            <ProjectReport
                              projectsReports={projectsReports}
                              startDate={startDateFrom}
                              endDate={endDateTo}
                            />
                          )}
                          {activeTab == 'Developer Report' && (
                            <DeveloperReport
                              developersReports={developersReports}
                            />
                          )}

                          {activeTab == 'Team Report' && (
                            <TeamReport teamReport={teamsReport} />
                          )}
                          {activeTab == 'Employees Report' && (
                            <EmployeesReport employeesReport={empsReport} />
                          )}

                          {activeTab == 'Work In Hand' && (
                            <WorkInHand
                              workInHandRes={workInHandRes}
                              projectModuleStatus={projectModuleStatus}
                              departmentId={user?.departmentId}
                            />
                          )}
                          {activeTab == 'Payment Pending' && (
                            <PaymentPending
                              paymentPendingReports={paymentPendingReports}
                              projectModuleStatus={projectModuleStatus}
                              projectPaymentsStatus={projectPaymentsStatus}
                              departmentId={user?.departmentId}
                            />
                          )}
                          {activeTab == 'Client Report' && (
                            <ClientReport clientReports={clientReportResonse} />
                          )}
                          {activeTab == 'Full Report' && (
                            <FullReport
                              clients={clients}
                              projects={projects}
                              employeeList={employeeList}
                              fullReportRes={fullReportRes}
                            />
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
    </>
  );
};
export default Reports;
