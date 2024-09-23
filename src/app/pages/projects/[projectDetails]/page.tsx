import React from 'react';
import getUser from '@/utils/getUserServerSide';
import SideNav from '@/components/common/SideBar/sidebar';
import Footer from '@/components/common/Footer/footer';
import Header from '@/components/common/Header/header';
import {
  individualProjectStatus,
  modulesDetails,
  projectModulesDetails,
  projectBillingDetails,
  projectEmployeeDetails,
  projectAssignedToEmployee,
  projectModulesStatus,
  projectPaymentStatus,
  projectsBillingType,
  projectsClientList,
  projectsHiring,
  teamLeadAndBDM,
  projectProductivity,
} from '@/utils/publicApi';
import { format } from 'date-fns';
import {
  BillingDetailsModel,
  BillingTypeModel,
  ClientModel,
  EmployeeDetailsModel,
  HiringModel,
  MemberModel,
  ModuleDetailsModel,
  ModuleStatusModel,
  ProjectBillingModel,
  ProjectEmployeeStatus,
  ProjectModuleBasicDetailsModel,
  ProjectModuleFormValue,
  StatusModel,
  TeamMembersInProjectModel,
} from '@/utils/types';
import EditProjectButton from '@/components/projects/editProjectDetailsButton';
import ModuleHeader from '@/components/projects/projectDetailsModuleHeader';
import EditModule from '@/components/projects/editModuleButton';
import DeleteModuleButton from '@/components/projects/deleteProjectModuleButton';
import ProjectModuleStatusDropdown from '@/components/projects/changeProjectModuleStatusDropdown';
import ProjectPaymentStatusDropdown from '@/components/projects/changeProjectPaymentStatusDropdown';
import DateFilter from '@/components/projects/dateFilterProjectModule';
import EditAssignedTeam from '@/components/projects/editAssignedTeam';
import Paginator from '@/components/projects/projectModulePagination';
import Link from 'next/link';

type Props = {
  params: {
    projectDetails: number;
  };
  searchParams: any;
};
const ProjectDetails = async ({ params, searchParams }: Props) => {

  const projectId = params.projectDetails;
  const token: any = getUser();
  const today = new Date();
  const startDate =
    searchParams.StartDate ??
    format(new Date(today.setDate(today.getDate() - 6)), 'yyyy-MM-dd');
  const endDate = searchParams.EndDate ?? format(new Date(), 'yyyy-MM-dd');
  const moduleStatus = searchParams.ModuleStatus ?? 'Open';
  const paymentStatus = searchParams.PaymentStatus ?? 'Pending';
const pageSize=searchParams.PageSize??10;
const pageNumber=searchParams.PageNumber??1;


  const payload: ProjectModuleFormValue = {
    id: projectId,
    moduleStatus: moduleStatus,
    paymentStatus: paymentStatus,
    startDate: startDate,
    endDate: endDate,
    departmentId: Number(token?.departmentId),
    pageSize:Number(pageSize),
    pageNumber:Number(pageNumber)
  };

  let totalRecords:number=0;
  let moduleDetails: ModuleDetailsModel[] = [];
  let projectModels: ProjectModuleBasicDetailsModel = {
    id: 0,
    name: '',
    description: '',
    createdTime: '',
    createdBy: '',
    clientName: '',
    notes: '',
    assignedTo: '',
    projectUpworkHours: 0,
    projectFixedHours: 0,
    projectOfflineHours: 0,
    projectGetID: '',
    projectListStartDate: null,
    projectListEndDate: null,
    productionUrl: '',
    stageUrl: '',
    projectStatus: 0,
    isBilling: 0,
    hiringStatus: 0,
    clientId: 0,
    invoiceProjectID: null,
    createdByUser: '',
  };
  let billingDetails: ProjectBillingModel[] = [];
  let employeeDetails: ProjectEmployeeStatus[] = [];
  let projectAssignedDetails: TeamMembersInProjectModel[] = [];
  let members: MemberModel[] = [];
  let projectModuleStatus: ModuleStatusModel[] = [];
  let projectPaymentsStatus: ModuleStatusModel[] = [];
  let hiringType: HiringModel[] = [];
  let billingType: BillingTypeModel[] = [];
  let clientList: ClientModel[] = [];
  let projectStatusData: StatusModel[] = [];
let productivity:any=0;
  try {
    const { bdm, teamLead } = await teamLeadAndBDM(Number(token?.departmentId));
    members = [...bdm, ...teamLead];
  } catch (error) {}
  try {
    projectAssignedDetails = await projectAssignedToEmployee(payload);
  } catch (error) {}
  try {
    projectModels = await projectModulesDetails(payload);
  } catch (error) {}

  try {
    projectPaymentsStatus = await projectPaymentStatus();
  } catch (error) {}

  try {
    projectModuleStatus = await projectModulesStatus();
  } catch (error) {}

  try {
    projectStatusData = await individualProjectStatus();
  } catch (error) {}

  try {
    clientList = await projectsClientList(Number(token?.departmentId));
  } catch (error) {}
  try {
    billingType = await projectsBillingType();
  } catch (error) {}
  try {
    hiringType = await projectsHiring();
  } catch (error) {}
  try {
    const result:any = await modulesDetails(payload);
    if (result) {
      const { results, totalCount } = result;
      moduleDetails=results;
      totalRecords=totalCount;
  } 
    
   
  } catch (error) {}
  try {
    billingDetails = await projectBillingDetails(payload);
  } catch (error) {}
  try {
    employeeDetails = await projectEmployeeDetails(payload);
  } catch (error) {}
  try {
    productivity = await projectProductivity(payload);
  } catch (error) {}

  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    // Format time string to HH:mm
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };

  const totalModuleEstimatedHours = () => {
    return numberToTimeConversion(
      moduleDetails
        .map((item: ModuleDetailsModel) => item.estimatedHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };

  const totalModuleBilledHours = () => {
    return numberToTimeConversion(
      moduleDetails
        .map((item: ModuleDetailsModel) => item.billedHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };

  const totalModuleNonBillableHours = () => {
    return numberToTimeConversion(
      moduleDetails
        .map((item: ModuleDetailsModel) => item.nonBillableHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };

  const totalBilledUpworkHours = () => {
    return numberToTimeConversion(
      billingDetails
        .map((item: BillingDetailsModel) => item.upworkHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };
  const totalBilledFixedHours = () => {
    return numberToTimeConversion(
      billingDetails
        .map((item: BillingDetailsModel) => item.fixedHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };
  const totalOfTotalBilledHours = () => {
    return numberToTimeConversion(
      billingDetails
        .map((item: BillingDetailsModel) => item.totalBilledHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };
  const totalOfNonBillableHours = () => {
    return numberToTimeConversion(
      billingDetails
        .map((item: BillingDetailsModel) => item.nonBillableHours)
        .reduce((a: number, b: number) => a + b, 0)
    );
  };

  const entriesCount=()=>{
    let count:any =employeeDetails?.map((item:any)=>item.date);
    count=new Set(count);
    count=[...count];
    return count.length;

  }

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
              <div className='main-container container-fluid'>
                <div className='row'>
                  <div className='col-xl-12'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between items-center projectName'>
                        <div className='card-title'>{projectModels?.name}</div>

                        <EditProjectButton
                          id={projectId}
                          projectStatusData={projectStatusData}
                          hiringType={hiringType}
                          billingType={billingType}
                          clientList={clientList}
                          members={members}
                        />
                      </div>
                      <div className='card-body'>
                        <div className='row gy-3'>
                         
                          <div className='col-xl-12 mt-0 project-detail-maincard'>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Creation Date :
                              </span>
                              {format(
                                new Date(projectModels?.createdTime),
                                'dd MMM yyyy'
                              )}
                            </p>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Created by :
                              </span>{' '}
                              {projectModels?.createdByUser}
                            </p>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Client Name :
                              </span>
                              {projectModels?.clientName}
                            </p>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                              Profile Name :
                              </span>
                             -
                            </p>
                           
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Status :
                              </span>{' '}
                              <span className='badge bg-success'>
                                {
                                  projectStatusData?.filter(
                                    (item) =>
                                      item.value == projectModels.projectStatus
                                  )[0].text
                                }
                              </span>{' '}
                            </p>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Note :
                              </span>
                              {projectModels?.notes}
                            </p>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Production Url :
                              </span>{' '}
                              <a href={projectModels?.productionUrl}>
                                {projectModels?.productionUrl}
                              </a>
                            </p>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Dev Url :
                              </span>{' '}
                              <a href={projectModels?.stageUrl}>
                                {projectModels?.stageUrl}
                              </a>
                            </p>
                            <p className="align-items-start d-flex gap-1"><span className="fw-semibold text-muted nowrap">Project Productivity :</span> {productivity?.productivity?(productivity?.productivity).toFixed(2):0}%</p>
                          </div>
                          <div className='col-xl-12'>
                          <div className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Assigned to :
                              </span>
                              {projectModels.assignedTo}
                              <EditAssignedTeam
                                projectName={projectModels?.name}
                                clientName={projectModels.clientName}
                                departmentId={Number(token?.departmentId)}
                                projectAssignedDetails={projectAssignedDetails}
                                payload={payload}
                              />
                            </div>
                            </div>
                          <div className='col-xl-12'>
                            <p className='align-items-start d-flex gap-1'>
                              <span className='fw-semibold text-muted nowrap'>
                                Description :{' '}
                              </span>
                              {projectModels.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='card custom-card'>
                      <ModuleHeader
                        payload={payload}
                        projectModuleStatus={projectModuleStatus}
                        projectPaymentsStatus={projectPaymentsStatus}
                      />
                      <div className='card-body Upwork_table employee_table'>
                        <div className='table-responsive theme_table'>
                          <table className='table text-nowrap table-hover border table-bordered'>
                            <thead>
                              <tr>
                                <th
                                  scope='col'
                                  style={{
                                    width: '70px',
                                  }}
                                >
                                  S.No
                                </th>
                                <th scope='col' className='module-width'>
                                  Module Name{' '}
                                </th>
                                <th scope='col'>Approved Hours </th>
                                <th scope='col'>Billed Hours </th>
                                <th scope='col'>Non Billable Hours</th>
                                <th scope='col'>Approved on</th>
                                <th scope='col'>Module Status </th>
                                <th scope='col'>Payment Status</th>
                                <th scope='col'>Action</th>
                              </tr>
                            </thead>
                            {moduleDetails.length > 0 && (
                              <tbody>
                                {moduleDetails.map(
                                  (item: ModuleDetailsModel, index: number) => (
                                    <tr key={item.id}>
                                      <td className='text-center'>
                                        {index + 1}
                                      </td>
                                      <td>{item.name}</td>
                                      <td className='text-success'>
                                        {numberToTimeConversion(
                                          item.estimatedHours
                                        )}
                                      </td>
                                      <td className='text-success text-bold'>
                                        <b>
                                          {numberToTimeConversion(
                                            item.billedHours
                                          )}
                                        </b>
                                      </td>
                                      <td className='text-danger'>
                                        {numberToTimeConversion(
                                          item.nonBillableHours
                                        )}
                                      </td>
                                      <td>
                                        {format(
                                          new Date(item.approvalDate),
                                          'dd-MM-yyyy'
                                        )}
                                      </td>
                                      <td>
                                        <ProjectModuleStatusDropdown
                                          id={item.id}
                                          departmentId={Number(
                                            token?.departmentId
                                          )}
                                          moduleStatusData={projectModuleStatus}
                                          moduleStatus={item.moduleStatus}
                                        />
                                      </td>
                                      <td>
                                        <ProjectPaymentStatusDropdown
                                          id={item.id}
                                          departmentId={Number(
                                            token?.departmentId
                                          )}
                                          paymentStatusData={
                                            projectPaymentsStatus
                                          }
                                          paymentStatus={item.paymentStatus}
                                        />
                                      </td>
                                      <td>
                                        <EditModule
                                          id={item.id}
                                          departmentId={Number(
                                            token?.departmentId
                                          )}
                                          payload={payload}
                                          projectModuleStatus={
                                            projectModuleStatus
                                          }
                                          projectPaymentsStatus={
                                            projectPaymentsStatus
                                          }
                                        />
                                        <DeleteModuleButton id={item.id} />
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            )}

                            {moduleDetails.length > 0 && (
                              <tfoot>
                                <tr>
                                  <td className='text-bold'>Total </td>
                                  <td></td>
                                  <td className='text-success'>
                                    {totalModuleEstimatedHours()}
                                  </td>
                                  <td className='text-success text-bold'>
                                    <b>{totalModuleBilledHours()}</b>
                                  </td>
                                  <td className='text-danger'>
                                    {totalModuleNonBillableHours()}
                                  </td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                          {moduleDetails.length == 0 && (
                            <span>No record found.</span>
                          )}
                        </div>
                      </div>
                      <div className='card-footer'>
                        <div className='d-flex align-items-center'>
                          <div>
                            {' '}
                            Showing {moduleDetails.length} Entries{' '}
                            <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
                          </div>
                          <div className='ms-auto'> <Paginator totalRecords={totalRecords} count={moduleDetails.length} data={payload}/></div>
                        </div>
                      </div>
                    </div>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between items-center'>
                        <div className='card-title'>Billing Details</div>
                        <div className='filter-right d-flex gap-x-2'>
                          <DateFilter payload={payload} />
                        </div>
                      </div>
                      <div className='card-body Upwork_table employee_table'>
                        <div className='table-responsive theme_table'>
                          <table className='table text-nowrap table-hover border table-bordered'>
                            <thead>
                              <tr>
                                <th scope='col'>Developer Name</th>
                                <th scope='col'>Module Name </th>
                                <th scope='col'>Upwork Hours</th>
                                <th scope='col'>Fixed Billing Hours</th>
                                <th scope='col'>Total Billed Hours</th>
                                <th scope='col'>Non Billable Hours</th>
                              </tr>
                            </thead>
                            {billingDetails?.length > 0 && (
                              <tbody>
                                {billingDetails.map(
                                  (
                                    item: BillingDetailsModel,
                                    index: number
                                  ) => (
                                    <tr key={index}>
                                      <td><Link href='#'
                                      // href={user.id==employee.employeeId?'/profile':`/employees/${employee.employeeId}`}
                                       >{item.developerName}</Link></td>
                                      <td>{item.projectModuleName}</td>
                                      <td>
                                        {numberToTimeConversion(
                                          item.upworkHours
                                        )}
                                      </td>
                                      <td>
                                        {numberToTimeConversion(
                                          item.fixedHours
                                        )}
                                      </td>
                                      <td className='text-success text-bold'>
                                        <b>
                                          {numberToTimeConversion(
                                            item.totalBilledHours
                                          )}
                                        </b>
                                      </td>
                                      <td className='text-danger'>
                                        {numberToTimeConversion(
                                          item.nonBillableHours
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            )}

                            <tfoot>
                              {billingDetails?.length > 0 && (
                                <tr>
                                  <td className='text-bold'>Total </td>
                                  <td></td>
                                  <td>{totalBilledUpworkHours()}</td>
                                  <td>{totalBilledFixedHours()}</td>
                                  <td className='text-success text-bold'>
                                    <b>{totalOfTotalBilledHours()}</b>
                                  </td>
                                  <td className='text-danger'>
                                    {totalOfNonBillableHours()}
                                  </td>
                                </tr>
                              )}
                            </tfoot>
                          </table>
                          {billingDetails?.length == 0 && (
                            <span>No record found.</span>
                          )}
                        </div>
                      </div>
                      <div className='card-footer'>
                        <div className='d-flex align-items-center'>
                          <div>
                            {' '}
                            Showing {billingDetails?.length} Entries{' '}
                            <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
                          </div>
                          <div className='ms-auto'></div>
                        </div>
                      </div>
                    </div>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between items-center'>
                        <div className='card-title'>Employee Status</div>
                        <div className='filter-right d-flex gap-x-2'>
                          <DateFilter payload={payload} />
                        </div>
                      </div>
                      <div className='card-body Upwork_table employee_table'>
                        <div className='table-responsive theme_table'>
                          <table className='table text-nowrap table-hover border table-bordered employeeStatus_table'>
                            <thead>
                              <tr>
                                <th scope='col'>Date</th>
                                <th scope='col'>Name</th>
                                <th scope='col' className='project-width'>
                                  Project Name
                                </th>
                                <th scope='col'>Client Name</th>
                                <th scope='col' className='module-width'>
                                  Module
                                </th>
                                <th scope='col' className='profile-width'>
                                  Profile
                                </th>
                                <th scope='col' className='memo-width'>
                                  Memo{' '}
                                </th>
                                <th scope='col'>Upwork Hours</th>
                                <th scope='col'>Fixed Billing Hours</th>
                                <th scope='col'>Non Billable Hours</th>
                              </tr>
                            </thead>
                            {employeeDetails?.length > 0 && (
                              <tbody>
                                {employeeDetails?.map(
                                  (
                                    item: EmployeeDetailsModel,
                                    index: number,
                                    employeeDetails: EmployeeDetailsModel[]
                                  ) => (
                                    <tr
                                      className={
                                        index == 0
                                          ? 'mainuser'
                                          : employeeDetails[index].date !==
                                              employeeDetails[index - 1].date
                                            ? 'mainuser'
                                            : ''
                                      }
                                      key={index}
                                    >
                                      <td>
                                        {format(
                                          new Date(item.date),
                                          'dd-MM-yyyy'
                                        )}
                                      </td>
                                      <td>
                                        <b><Link  href={token .id==item.applicationUsersId?'/profile':`/employees/${item.applicationUsersId}`}>{item.employeeName}</Link></b>
                                      </td>
                                      <td>{item.projectName}</td>
                                      <td>{item.clientName}</td>
                                      <td>{item.moduleName}</td>
                                      <td>{item.profileName}</td>
                                      <td>{item.memo}</td>
                                      <td>
                                        {numberToTimeConversion(
                                          item.upworkHours
                                        )}
                                      </td>
                                      <td>
                                        {numberToTimeConversion(
                                          item.fixedHours
                                        )}
                                      </td>
                                      <td className='text-danger'>
                                        {numberToTimeConversion(
                                          item.nonBillableHours
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            )}
                          </table>
                          {employeeDetails?.length == 0 && (
                            <span>No record found.</span>
                          )}
                        </div>
                      </div>
                      <div className='card-footer'>
                        <div className='d-flex align-items-center'>
                          <div>
                            {' '}
                            Showing {entriesCount()} Entry{' '}
                            <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
                          </div>
                          <div className='ms-auto'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Assigned Modal--> */}
                <div
                  className='offcanvas offcanvas-end ModalW500'
                  id='ProjectAssignedModal'
                  aria-labelledby='ProjectAssignedModalLabel'
                >
                  <div className='offcanvas-header'>
                    <h5>GeoData Direct - Erik wind</h5>
                    <button
                      type='button'
                      className='btn-close text-reset'
                      data-bs-dismiss='offcanvas'
                      aria-label='Close'
                    >
                      <i className='fe fe-x fs-18'></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* <!-- CONTAINER END --> */}
            </div>
          </div>
        </div>

        {/* FOOTER  */}
        <Footer />
      </div>
    </>
  );
};

export default ProjectDetails;
