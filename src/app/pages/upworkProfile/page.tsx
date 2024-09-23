import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
import { DepartmentModel, UpworkReqParams } from '@/utils/types';
import getUser from '@/utils/getUserServerSide';
import { UpworkProfile, allDepartments, ProfileList } from '@/utils/publicApi';
import DeleteButton from '@/components/upwork/deleteButton';
import EditButton from '@/components/upwork/editButton';
import Paginator from '@/components/projects/pagination';
import UpworkSearch from '@/components/upwork/upworkSearch';
import CreateProfile from '@/components/upwork/createProfile';
import Footer from '@/components/common/Footer/footer';

const upworkProfile = async ({ searchParams }: any) => {
  const user: any = getUser();
  let profileList: any;

  try {
    profileList = await ProfileList();
  } catch (error) {}

  const getDepartment: DepartmentModel[] = await allDepartments();

  let pageSize = searchParams?.size ?? 10;
  let currentPage = searchParams?.page ?? 1;
  let searchQuery = searchParams?.search ?? '';

  const reqParams: UpworkReqParams = {
    departmentID: user.departmentId,
    pageSize: pageSize,
    currentPage: currentPage,
    searchValue: searchQuery,
  };

  const upworkprofilerecords = await UpworkProfile(reqParams);

  const totalCount = upworkprofilerecords?.model?.totalCount || 0;
  const totalEntries =
    totalCount < pageSize * currentPage ? totalCount : pageSize * currentPage;

  return (
    <>
      <div className='app sidebar-mini ltr light-mode'>
        <div className='page-main'>
          {/* /app-Header */}
          {/*APP-SIDEBAR*/}

          <Header />
          <SideNav />

          {/*/APP-SIDEBAR*/}
          {/*app-content open*/}
          <div className='main-content app-content mt-0'>
            <div className='side-app'>
              {/* CONTAINER */}
              <div className='main-container container-fluid'>
                <div className='row'>
                  <div className='col-sm-12 col-xl-6'>
                    <CreateProfile
                      getDepartment={getDepartment}
                      profileList={profileList}
                    />
                  </div>
                </div>
                {/* ROW-2 */}
                <div className='row'>
                  <div className='col-sm-12 col-xl-6'>
                    <div className='card custom-card'>
                      <div className='card-header justify-content-between awards_card_header'>
                        <div className='card-title'>Upwork Profile</div>
                        <div className='filter-right d-flex gap-x-2'>
                          <div className='search_box'>
                            <i className='ri-search-line' />
                           <UpworkSearch params={reqParams}/>
                          </div>
                        </div>
                      </div>
                      <div className='card-body'>
                        <div className='table-responsive theme_table'>
                          <table className='table text-nowrap table-hover border table-bordered'>
                            <thead>
                              <tr>
                                <th scope='col'>User Name</th>
                                <th scope='col'>Department</th>
                                <th scope='col'>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {upworkprofilerecords?.model.results.map(
                                (upwork: any) => (
                                  <tr key={upwork.id}>
                                    <td>{upwork.name} </td>
                                    <td>{upwork.departmentName}</td>

                                    <td>
                                      <EditButton
                                        id={upwork.id.toString()}
                                        profileList={profileList}
                                        getDepartment={getDepartment}
                                      />
                                      <DeleteButton id={upwork.id} />
                                    </td>
                                  </tr>
                                )
                              )}
                              {upworkprofilerecords?.model.results.length ===
                                0 && <tr>No record found.</tr>}
                            </tbody>
                          </table>
                          <div className='card-footer'>
                            <div className='d-flex align-items-center'>
                              Total Showing Entries {totalEntries} {''}
                              out of{' '}
                              {upworkprofilerecords?.model.totalCount ?? 0}
                              &nbsp;
                              <Paginator
                                totalRecords={
                                  upworkprofilerecords?.model.totalCount
                                }
                                data={reqParams}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              
              </div>
              {/* CONTAINER END */}
            </div>
          </div>
          {/*app-content close*/}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default upworkProfile;
