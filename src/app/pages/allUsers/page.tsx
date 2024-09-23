import SearchUser from '@/components/allUser/searchFilter';
import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
import { getAllUsers } from '@/utils/publicApi';
import { UserParam } from '@/utils/types';
import Image from 'next/image';
import getUser from '@/utils/getUserServerSide';

const AllUsers = async ({ searchParams }: any) => {
  let users: any;
  let token: any;

  token = getUser();

  let searchQuery = searchParams?.search ?? '';
  let data: UserParam = {
    searchValue: searchQuery,
    departmentId: token.departmentId
  };

  try {
    users = await getAllUsers(data);
  } catch (error) {
    console.error('Error fetching users:', error);
  }


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
                  <div className='col-xl-12'>
                    <div className='card custom-card mt-4'>
                      <div className='card-body'>
                        <div className='contact-header'>
                          <div className='d-sm-flex d-block align-items-center justify-content-between'>
                            <div className='h5 fw-semibold mb-0'>
                              All Users
                            </div>
                            <div className='search_box'>
                              <i className='ri-search-line' />
                              <SearchUser />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  {users.results.map((user: any) => (
                    <div
                      key={user.id}
                      className='col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-sm-12'
                    >
                      <div className='card custom-card all_userCard'>
                        <div className='card-body contact-action'>
                          <div className='contact-overlay'></div>
                          <div className='d-flex align-items-top'>
                            <div className='d-flex flex-fill flex-wrap gap-3'>
                              <div className='avatar avatar-2xl avatar-rounded'>
                                <Image
                                  src={`https://3t-api.csdevhub.com/images/${user.profileImage}`}
                                  alt='Profile Image'
                                  height={50}
                                  width={50}
                                />
                              </div>
                              <div>
                                <div className='mb-0 fw-semibold'>
                                  <a href={`/employees/${user.id}`}>
                                    {user.name}
                                  </a>
                                </div>
                                <p className='mb-1 text-muted contact-mail text-truncate fs-13'>
                                  {user.designation}
                                </p>
                                <p className='mb-1 text-muted contact-mail text-truncate'>
                                  {user.email}
                                </p>
                                <p className='fw-semibold fs-11 mb-0 text-primary blurphoneNumber'>
                                  +1(555) 354 2345
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
