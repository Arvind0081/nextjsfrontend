import AdminTeamStructure from '@/components/adminDepartment/adminTeamStructure';
import AngularTeamStructure from '@/components/adminDepartment/angularTeamStructure';
import BlazorTeamStructure from '@/components/adminDepartment/blazorTeamStructure';
import DotnetTeamStructure from '@/components/adminDepartment/dotnetTeamStructure';
import HrTeamStructure from '@/components/adminDepartment/hrTeamStructure';
import NextTeamStructure from '@/components/adminDepartment/nextTeamStructure';
import OverAllPerformance from '@/components/adminDepartment/overAllPerformance';
import OverallPerformanceDateFilter from '@/components/adminDepartment/overallPerformanceDateFilter';
import ReactTeamStructure from '@/components/adminDepartment/reactTeamStructure';
import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
import { DepartmentOverallDetails, departments, DepartmentWiseOverallDetails, managerList } from '@/utils/publicApi';
import { AdminProductivityParam, DepartmentModel } from '@/utils/types';
const AdminDepartment =async ({searchParams}:any) => {

    const date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    const selectedMonth = searchParams.month ?? `${year}-${month}`;
    [year, month] = selectedMonth.split('-');

    let departmentData: DepartmentModel[] = [];
  let allDepartmentproductivity:any
  let departmentID = searchParams?.departmentId ?? 1;
  let departmentWiseOverallDetails:any
  let getManagerList: any;

    let reqParams: AdminProductivityParam = {
        month: Number(month),
        year: Number(year),
    };

    try {
        allDepartmentproductivity =await DepartmentOverallDetails(reqParams)
    } catch (error) {
        
    }

  
    try {
        departmentWiseOverallDetails =await DepartmentWiseOverallDetails()
    } catch (error) {
        
    }
    try {
        departmentData = await departments();
   

    } catch (error) {}

    try {
        getManagerList = await managerList(departmentID);

    } catch (error: any) {}

console.log('departmentData',departmentData)

  return (
    <div className='app sidebar-mini ltr light-mode'>
      <div className='page'>
        <div className='page-main'>
        <Header getManagerList={getManagerList} departmentData={departmentData} />
          <SideNav />
          <div className='main-content app-content mt-0'>
            <div className='side-app'>
              <div className='main-container container-fluid'>
                <div className='row'>
                  <div className='col-xl-12'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>OverAll Performance</div>
                        <div
                          className='btn-group'
                          role='group'
                          aria-label='Basic example'
                        >

                            <OverallPerformanceDateFilter month={selectedMonth}/>
                          {/* <button
                            type='button'
                            className='btn btn-primary btn-sm btn-wave'
                          >
                            1M
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary-light btn-sm btn-wave'
                          >
                            6M
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary-light btn-sm btn-wave'
                          >
                            1Y
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary-light btn-sm btn-wave'
                          >
                            All
                          </button> */}
                        </div>
                      </div>
                      <div className='card-body'>
                        <div className='Overall-Performance'>
                        <OverAllPerformance allDepartmentproductivity={allDepartmentproductivity} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>Dot Net Team Structure</div>
                      </div>
                      <div className='card-body'>
                      
                        <div className='department-Performance'>
                         <DotnetTeamStructure departmentWiseOverallDetails={departmentWiseOverallDetails}  />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>Admin Team Structure</div>
                      </div>
                      <div className='card-body'>
                      
                        <div className='department-Performance'>
                         <AdminTeamStructure departmentWiseOverallDetails={departmentWiseOverallDetails}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>Angular Team Structure</div>
                      </div>
                      <div className='card-body'>
                      
                        <div className='department-Performance'>
                       <AngularTeamStructure departmentWiseOverallDetails={departmentWiseOverallDetails}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>
                          React Marketing Team Structure
                        </div>
                      </div>
                      <div className='card-body'>
                      
                        <div className='department-Performance'>
                      <ReactTeamStructure departmentWiseOverallDetails={departmentWiseOverallDetails}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>IT Team Structure</div>
                      </div>
                      <div className='card-body'>
                        
                        <div className='department-Performance'>
                        <NextTeamStructure  departmentWiseOverallDetails={departmentWiseOverallDetails}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>Blazor Team Structure</div>
                      </div>
                      <div className='card-body'>
                        
                        <div className='department-Performance'>
                        <BlazorTeamStructure  departmentWiseOverallDetails={departmentWiseOverallDetails}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-xl-4'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between'>
                        <div className='card-title'>HR Team Structure</div>
                      </div>
                      <div className='card-body'>
                        
                        <div className='department-Performance'>
                        <HrTeamStructure  departmentWiseOverallDetails={departmentWiseOverallDetails}/>
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
    </div>
  );
};
export default AdminDepartment;
