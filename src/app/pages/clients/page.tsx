import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
import { allDepartments, clientsById } from '@/utils/publicApi';
import getUser from '@/utils/getUserServerSide';
import ClientSearch from '@/components/clients/clientSearch';
import ExportExcel from '@/components/common/ExportExcel/exportToExcel';
import DeleteButton from '@/components/clients/deleteButton';
import Paginator from '@/components/projects/pagination';
import AddClient from '@/components/clients/addClientButton';
import EditButton from '@/components/common/Edit/editButton';
import ToggleButton from '@/components/clients/toggleButton';
import Footer from '@/components/common/Footer/footer';

const Clients = async ({ searchParams }: any) => {
  let pageSize = searchParams?.size ?? 10;
  let currentPage = searchParams?.page ?? 1;
  let searchQuery = searchParams?.search ?? '';

  let showListContent = searchParams?.showListContent ?? 'true';

  let user: any =  getUser();
  let department:any;
  let allClients :any;
  let reqParams = {
    departmentID: user.departmentId,
    currentPage: currentPage,
    pageSize: pageSize,
    searchValue: searchQuery,
    isActive: '',
    showListContent:showListContent
  };
  try {
    
    department = await allDepartments();
  } catch (error) {
    
  }
  try {
    
     allClients = await clientsById(reqParams);
  } catch (error) {
    
  }
 
  
  const totalCount = allClients?.model?.totalCount || 0;
  const totalEntries =
    totalCount < pageSize * currentPage ? totalCount : pageSize * currentPage;

  return (
    <>
      <div className="app sidebar-mini ltr light-mode">
        <div className="page">
          <div className="page-main">
           
              <Header />
              <SideNav />
         

            <div className="main-content app-content mt-0">
              <div className="side-app">
                <div className="main-container container-fluid">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="btn-list btn-list-right mb-4 d-flex align-items-center justify-content-end gap-x-2">
                        <ToggleButton params={reqParams} />
                        <span className="search_box">
                          <i className="ri-search-line" />
                          <ClientSearch params={reqParams} />
                        </span>
                        <ExportExcel />

                        <span>
                          <AddClient department={department}/>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 col-xl-12">
                      <div
                        className="card custom-card"
                        // style={{ background: "transparent" }}
                      >
                        {showListContent==='true' ? (
                          <div
                            className="clientList_box card custom-card clientRight_Box bg-transparent"
                            id="listContent"
                          >
                            <div className="card-body">
                              <div className="table-responsive theme_table">
                                <table className="table text-nowrap table-hover border table-bordered">
                                  <thead>
                                    <tr>
                                      <th scope="col">Name</th>
                                      <th scope="col">Billing Address</th>
                                      <th scope="col">Skype Id</th>
                                      <th scope="col">Country</th>
                                      <th scope="col">Company Name</th>
                                      <th scope="col">Department</th>
                                      <th scope="col">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allClients?.model.results.map((client:any) => (
                                      <tr key={client.id}>
                                        <td>{client.name}</td>
                                        <td>{client.billingAddress}</td>
                                        <td>{client.skypeid}</td>
                                        <td>{client.country}</td>
                                        <td>{client.clientCompanyName}</td>
                                        <td>
                                          {
                                            department.filter(
                                              (item:any) =>
                                                item.id ==
                                                Number(client.departmentId)
                                            )[0].name
                                          }
                                        </td>

                                        <td>
                                          <EditButton
                                            id={client.id.toString()}
                                            department={department}
                                          />
                                          <DeleteButton
                                            id={client.id.toString()}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                    {allClients?.model.results.length == 0 && (
                                      <tr>
                                        <td className="5">No record found.</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                <div className="card-footer">
                                  <div className="d-flex align-items-center">
                                    Total Showing Entries {totalEntries}
                                    out of {allClients?.model.totalCount ?? 0}
                                    &nbsp;
                                    <Paginator
                                      totalRecords={
                                        allClients?.model.totalCount
                                      }
                                      data={reqParams}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className=" clientList_box card custom-card clientRight_Box bg-transparent"
                            id="GridContent"
                          >
                            <div className="clientList_Content">
                              {allClients?.model.results.map((client:any) => (
                                <div
                                  key={client.id}
                                  className="card custom-card status-card"
                                >
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between gap-2">
                                      <div className="fs-12">
                                        <p className="fw-semibold mb-1 d-flex align-items-center fs-13 gap-x-2">
                                          {client.name}
                                        </p>

                                        <p className="mb-1">
                                          Email :
                                          <span className="mb-1 text-muted">
                                            {client.email}
                                          </span>
                                        </p>

                                        <p className="mb-1">
                                          Billing Address :
                                          <span className="mb-1 text-muted">
                                            {client.billingAddress}
                                          </span>
                                        </p>

                                        <p className="mb-1">
                                          Skype Id :
                                          <span className="mb-1 text-muted">
                                            {client.skypeid}
                                          </span>
                                        </p>

                                        

                                        <p className="mb-1">
                                          Country :
                                          <span className="mb-1 text-muted">
                                            {client.country}
                                          </span>
                                        </p>

                                        <p className="mb-1">
                                        Company Name :
                                          <span className="mb-1 text-muted">
                                            {client.clientCompanyName}
                                          </span>
                                        </p>

                                        <p className="mb-1">
                                          Department :
                                          <span className="mb-1 text-muted">
                                          {
                                            department.filter(
                                              (item:any) =>
                                                item.id ==
                                                Number(client.departmentId)
                                            )[0].name
                                          }
                                          </span>
                                        </p>

                                        <td>
                                          <EditButton
                                            id={client.id.toString()}
                                            department={department}
                                          />
                                          <DeleteButton
                                            id={client.id.toString()}
                                          />
                                        </td>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
    </>
  );
};

export default Clients;