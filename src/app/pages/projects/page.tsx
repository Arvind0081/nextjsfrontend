import React from 'react';
import SideNav from '@/components/common/SideBar/sidebar';
import Footer from '@/components/common/Footer/footer';
import Header from '@/components/common/Header/header';
import { format } from 'date-fns';
import {projectsStatus,projects, projectsHiring, projectsBillingType, projectsClientList, individualProjectStatus, teamLeadAndBDM,projectsHiringFilter,projectsBillingTypeFilter, salesPersonList} from '@/utils/publicApi';
import {ProjectInfoModel,GetAllProjectsParamsModel} from '@/utils/types';
import Search from '@/components/projects/search';
import ProjectStatus from '@/components/projects/projectStatus';
import Paginator from '@/components/projects/pagination';
import ShowEntries from '@/components/projects/showEntries';
import AddProjectButton from '@/components/projects/addProjectButton';
import EditProjectButton from '@/components/projects/editProjectButton';
import getUser from '@/utils/getUserServerSide';
import Notes from '@/components/projects/notesButton';
import ProjectStatusDropdown from '@/components/projects/changeProjectStatusDropdown';
import DeleteProjectButton from '@/components/projects/deleteProjectButton';
import Link from 'next/link';
import DateFilter from '@/components/projects/dateFilterAllProjects';
import UploadFiles from '@/components/projects/uploadProjectFiles';
import DownloadFiles from '@/components/projects/downloadProjectFiles';
import BillingAndHiringStatusFilter from '@/components/projects/billingAndHiringStatusFilter';

const Projects = async({searchParams}:any) => {

    let projectStatus:number =searchParams.status ?? 2;
    let pageSize:number= searchParams.size ?? 10;
    let searchValue:string=searchParams.search ??'';
    let currentPage:number= searchParams.page ?? 1;
    let hiringStatusId:number= searchParams.hiringStatus ?? 0;
    let bilingTypeId:number= searchParams.bilingType ?? 0;
    let teamAdminId:string= searchParams.teamAdminId ?? '';
    let today=new Date();
    let startDate=searchParams.startDate??format(new Date(today.setDate(today.getDate() - 6)), 'yyyy-MM-dd');
    let endDate=searchParams.endDate??format(new Date(), 'yyyy-MM-dd');  
    let allProjects:ProjectInfoModel[]=[];
    let totalRecords:number=0;
    let clientList:any;
    let billingType:any;
    let billingTypeFilter:any;
    let statusData :any;
    let hiringType :any;
    let hiringTypeFilter :any;
    let result :any;
    let members :any;
    let salesPerson:any;
    const token:any=getUser();
try {
  statusData= await projectsStatus();
  } catch (error) {
    
  }
try {
     hiringType= await projectsHiring();
} catch (error) {
    
}
try {
    hiringTypeFilter= await projectsHiringFilter();
} catch (error) {
   
}
try {
    billingType= await projectsBillingType(); 
} catch (error) {
    
}
try {
    billingTypeFilter= await projectsBillingTypeFilter(); 
} catch (error) {
    
}

try {
    
    clientList = await projectsClientList(Number(token?.departmentId));
  } catch (error) {
    
  }

const projectStatusData= await individualProjectStatus();
  
let data:GetAllProjectsParamsModel={
    'departmentId': Number(token?.departmentId),
    'pageNumber': currentPage,
    'pageSize': pageSize,
    'searchValue': searchValue,
    'projectStatus': projectStatus,
    'startDate': startDate,
    'endDate': endDate,
    'sortOrder': '',
    'sortColumn': '',
    'hiringStatus': hiringStatusId,
    'bilingType': bilingTypeId,
    'teamAdminId':teamAdminId,
}

  try {
     result = await projects(data);
     if (result) {
        const { projects, totalCount } = result;
        allProjects=projects;
        totalRecords=totalCount;
    } 
  } catch (error) {
    
  }

  try {
    const response = await salesPersonList(Number(token?.departmentId));
if (response) {
    salesPerson=response;
}
    
  } catch (error) {
    
  }

const response = await teamLeadAndBDM(Number(token?.departmentId));
if (response) {
    const {bdm,teamLead} =response;
 members=[...bdm,...teamLead];
}


    const showingRecordCount = () => {
        const Count=((currentPage -1)* pageSize + Math.ceil(allProjects.length))<=totalRecords?((currentPage -1)* pageSize + Math.ceil(allProjects.length)):totalRecords;
    
        return Count ;
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
                            <div className='main-container container-fluid'>
                                {/* <!-- Project --> */}
                                <div className='row'>
                                    <div className='col-xl-12'>
                                        <div className='card custom-card'>
                                            <div className='card-header justify-content-between'>
                                            <div className='filter-right d-flex gap-x-2 project_leftBox'>
                                                <DateFilter  data={data}/>
                                                  </div>
                                                
                                                <div className='filter-right d-flex gap-x-2'>
                                             <BillingAndHiringStatusFilter data={data} hiringTypeFilter={hiringTypeFilter} billingTypeFilter={billingTypeFilter}/>
                                                   <ProjectStatus statusData={statusData} data={data}/>
                                                    <AddProjectButton projectStatusData={projectStatusData} hiringType={hiringType} billingType={billingType} clientList={clientList} members={members} salesPerson={salesPerson}/>
                                                </div>
                                            </div>
                                            <div className='card-body'>
                                                <div className='d-flex flex-wrap justify-content-between dataTable_filterBox'>
                                                    <ShowEntries  data={data}/>
                                                    <Search data={data} />
                                                </div>
                                                <div className='table-responsive theme_table'>
                                                    <table className='table text-nowrap table-hover border table-bordered'>
                                                        <thead>
                                                            <tr>
                                                                <th scope='col'>
                                                                    Project Id
                                                                </th>
                                                                <th
                                                                    scope='col'
                                                                    className='project-width'
                                                                >
                                                                    Project Name
                                                                </th>
                                                                <th scope='col'>
                                                                    Description
                                                                </th>
                                                                <th scope='col'>
                                                                    Client Name
                                                                </th>
                                                                <th scope='col'>
                                                                    Notes
                                                                </th>
                                                                <th scope='col'>
                                                                    Created Date
                                                                </th>
                                                                <th scope='col'>
                                                                Billing Type
                                                                </th>
                                                                <th scope='col'>
                                                                Hiring Status
                                                                </th>
                                                                <th scope='col'>
                                                                    Docs
                                                                </th>
                                                                <th scope='col'>
                                                                    Actions
                                                                </th>
                                                                <th
                                                                    scope='col'
                                                                    className='w200'
                                                                >
                                                                    Status
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {allProjects.map(
                                                                (project) => (
                                                                    <tr key={project.id}>
                                                                        <td className='text-nowrap'>
                                                                            {
                                                                                project.id
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <Link
                                                                                href={`/projects/${project.id}`}
                                                                                className='btn-link text-normal'
                                                                            >
                                                                                {
                                                                                    project.name
                                                                                }
                                                                            </Link>
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                project.description
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                project.clientName
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                           <Notes id={project.id} />
                                                                        </td>
                                                                        <td>
                                                                           {format(new Date(project.createdTime), 'yyyy-MM-dd')}
                                                                        </td>
                                                                        <td>
                                                                           {billingType?.filter((item: { value: number; })=>item.value==project.isBilling)[0].text}
                                                                        </td>
                                                                        <td>
                                                                           {hiringType?.filter((item: { value: number; })=>item.value==project.hiringStatus)[0].text}
                                                                        </td>
                                                                        <td>
                                                                            <div className='align-items-start d-flex fs-15 gap-2'>
                                                                               <UploadFiles id={project.id}/>
                                                                               <DownloadFiles id={project.id} />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className='align-items-start d-flex fs-15 gap-2'>
                                                                               <EditProjectButton id={ project.id}  projectStatusData={projectStatusData} hiringType={hiringType} billingType={billingType} clientList={clientList} members={members} salesPerson={salesPerson}/>
                                                                               <DeleteProjectButton id={project.id} />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {' '}
                                                                           <ProjectStatusDropdown id={project.id} projectStatusData={projectStatusData} projectStatus={project.projectStatus}/>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                            
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {allProjects.length ==
                                                                0 && (
                                                                <span>
                                                                    No record
                                                                    found.
                                                                </span>
                                                            )}
                                            </div>
                                            <div className='card-footer'>
                                                <div className='d-flex align-items-center'>
                                                    <div>
                                                        {' '}
                                                        Showing{' '}
                                                        {showingRecordCount()}{' '}
                                                        Entries{' '}
                                                        <i className='bi bi-arrow-right ms-2 fw-semibold'></i>
                                                    </div>
                                                    <div className='ms-auto'>
                                                        <Paginator totalRecords={totalRecords} data={data}/>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Projects END --> */}

                                {/* <!--Delete Modal --> */}
                                <div
                                    className='modal fade'
                                    id='DeleteModal'
                                >
                                    <div
                                        className='modal-dialog modal-dialog-centered text-center'
                                        role='document'
                                    >
                                        <div className='modal-content tx-size-sm'>
                                            <div className='modal-body text-center p-4 pb-5'>
                                                <button
                                                    aria-label='Close'
                                                    className='btn-close position-absolute'
                                                    data-bs-dismiss='modal'
                                                >
                                                    <span aria-hidden='true'>
                                                        &times;
                                                    </span>
                                                </button>
                                                <i className='icon icon-close fs-70 text-danger lh-1 my-5 d-inline-block'></i>
                                                <h4 className='text-danger'>
                                                    Are you sure you want to
                                                    delete?
                                                </h4>
                                                <p className='mg-b-20 mg-x-20'>
                                                    Do you Really want to delete
                                                    this record?
                                                </p>
                                                <button
                                                    aria-label='Close'
                                                    className='btn btn-danger pd-x-25'
                                                    data-bs-dismiss='modal'
                                                >
                                                    Yes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Add Projects--> */}
                                

                                {/* <!-- Update Project--> */}
                                <div
                                    className='offcanvas offcanvas-end ModalW500'
                                    // tabIndex='-1'
                                    id='UpdateProjectModal'
                                    aria-labelledby='UpdateProjectModalLabel'
                                >
                                    <div className='offcanvas-header'>
                                        <h5>Update Project</h5>
                                        <button
                                            type='button'
                                            className='btn-close text-reset'
                                            data-bs-dismiss='offcanvas'
                                            aria-label='Close'
                                        >
                                            <i className='fe fe-x fs-18'></i>
                                        </button>
                                    </div>
                                    <div className='offcanvas-body'>
                                        <form className='status-repeat-box row m-0'>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputCity'>
                                                    Project Name
                                                </label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Hiring Status
                                                </label>
                                                <select
                                                    id='inputState'
                                                    className='form-control'
                                                >
                                                    <option value='0'>
                                                        Choose Hiring Status
                                                    </option>
                                                    <option value='1'>
                                                        Agency
                                                    </option>
                                                    <option value='2'>
                                                        Freelancer
                                                    </option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Client Name
                                                </label>
                                                <select
                                                    id='inputState'
                                                    className='form-control'
                                                >
                                                    <option>
                                                        Select Profile
                                                    </option>
                                                    <option>...</option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Status
                                                </label>
                                                <select
                                                    id='inputState'
                                                    className='form-control'
                                                >
                                                    <option>
                                                        Select Status
                                                    </option>
                                                    <option>...</option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Billing Type
                                                </label>
                                                <select
                                                    id='inputState'
                                                    className='form-control'
                                                >
                                                    <option>
                                                        Choose Billing Type
                                                    </option>
                                                    <option>...</option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Project Invoice ID
                                                </label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Production Url
                                                </label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                            <div className='col-md-6 form-group'>
                                                <label htmlFor='inputState'>
                                                    Dev/Stage Url
                                                </label>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                            <div className='col-md-12 form-group'>
                                                <label htmlFor='inputCity'>
                                                    Description{' '}
                                                </label>
                                                <textarea
                                                    id='inputState'
                                                    className='form-control h50'
                                                ></textarea>
                                            </div>
                                            <div className='col-md-12 form-group'>
                                                <label htmlFor='inputCity'>
                                                    Important Notes{' '}
                                                </label>
                                                <textarea
                                                    id='inputState'
                                                    className='form-control h100'
                                                ></textarea>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='offcanvas-footer text-right'>
                                        <button
                                            type='submit'
                                            className='btn btn-primary'
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* <!-- Notes--> */}
                                <div
                                    className='offcanvas offcanvas-end ModalW500'
                                    // tabIndex='-1'
                                    id='NotesProjectModal'
                                    aria-labelledby='NotesProjectModalLabel'
                                >
                                    <div className='offcanvas-header'>
                                        <h5>Project Notes</h5>
                                        <button
                                            type='button'
                                            className='btn-close text-reset'
                                            data-bs-dismiss='offcanvas'
                                            aria-label='Close'
                                        >
                                            <i className='fe fe-x fs-18'></i>
                                        </button>
                                    </div>
                                    <div className='offcanvas-body'>
                                        <div className='row'>
                                            <div className='col-md-12 form-group'>
                                                <textarea
                                                    id='inputState'
                                                    className='form-control'
                                                    style={{ height: '500px' }}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='offcanvas-footer text-right'>
                                        <button
                                            type='submit'
                                            className='btn btn-danger'
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type='submit'
                                            className='btn btn-primary'
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- CONTAINER--> */}
                        </div>
                        {/* <!-- CONTAINER END --> */}
                    </div>
                </div>

                {/* FOOTER  */}
                <Footer />
            </div>
        </>
    );
};

export default Projects;