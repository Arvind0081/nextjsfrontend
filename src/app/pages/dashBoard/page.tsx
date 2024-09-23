import Footer from '@/components/common/Footer/footer';
import Header from '@/components/common/Header/header';
import SideNav from '@/components/common/SideBar/sidebar';
 import getUser from '@/utils/getUserServerSide';
import DateFilter from '@/components/dashboard/dateFilter';

import {
  DepartmentModel,
  ManagerDashBoardModel,
  ProjectSummaryResponseModel,
  TeamProductivityResponseModel,
  TeamSummaryResponseModel,
} from '@/utils/types';
import {
  departments,
  managerList,
  projectsSummaryByManager,
  teamProductivitySummaryByManager,
  teamSummaryByManager,
} from '@/utils/publicApi';
import Link from 'next/link';
import CustomLinearProgress from '@/components/dashboard/customLinearProgress';

const Dashboard = async ({ searchParams }: any) => {
   const user: any = getUser();
   let teamAdminId: string = searchParams.teamAdminId ?? '';
   let managerId = searchParams.managerId??'';
  let departmentID = searchParams?.departmentId ?? 1;
  let teamProductivity: TeamProductivityResponseModel[] = [];
  let departmentData: DepartmentModel[] = [];
  let getManagerList: any;
  let projectsSummary: ProjectSummaryResponseModel = {
    totalEmployees: 0,
    productivityPercentage: 0,
    workInHand: 0,
    pendingPayment: 0,
    teamAdminId: teamAdminId
  };
  let teamSummary: TeamSummaryResponseModel[] = [];



  const date = new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  const selectedMonth = searchParams.month ?? `${year}-${month}`;
  [year, month] = selectedMonth.split('-');

  let payload: ManagerDashBoardModel = {
    teamAdminId: user.role === 'Admin' ? managerId : teamAdminId ,
    departmentId: departmentID??0,
    month: Number(month),
    year: Number(year),
  };


  try {
    teamProductivity = await teamProductivitySummaryByManager(payload);
  } catch (error) {}

  try {
    projectsSummary = await projectsSummaryByManager(payload);
  } catch (error) {}

  try {
    teamSummary = await teamSummaryByManager(payload);
  } catch (error) {}

  try {
    departmentData = await departments();


} catch (error) {}

try {
    getManagerList = await managerList(departmentID);

} catch (error: any) {}



  // ${getDesignationClass(Number(member.teamMemberExperienceOnJoining))}
  // const getDesignationClass = (years: number) => {
  //   switch (true) {
  //     case (years >= 0 && years < 6):
  //       return 'OtherbgColor';
  //     case (years >= 6 && years < 24):
  //       return 'traineerbgColor';
  //       case (years >= 24 && years < 48):
  //       return 'Two_fourbgColor';
  //       case (years >= 48 && years < 72):
  //       return 'four_sixbgColor';
  //       case (years >= 72 && years < 96):
  //       return 'six_eightbgColor';
  //       case (years >= 96 && years < 120):
  //         return 'Eight_tenbgColor';
  //         case (years >= 120 ):
  //         return 'tenYear_bgColor';
  //     // Add other designations as needed
  //     default:
  //       return 'OtherbgColor';
  //   }
  // };

  const getDesignationNameClass = (years: number) => {
    switch (true) {
      case (years >= 0 && years < 6):
        return 'OtherColor';
      case (years >= 6 && years < 24):
        return 'traineerColor';
        case (years >= 24 && years < 48):
        return 'Two_fourColor';
        case (years >= 48 && years < 72):
        return 'four_sixColor';
        case (years >= 72 && years < 96):
        return 'six_eightColor';
        case (years >= 96 && years < 120):
          return 'Eight_tenColor';
          case (years >= 120 ):
          return 'tenYear_Color';
      // Add other designations as needed
      default:
        return 'OtherColor';
    }
  };

  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    // Format time string to HH:mm
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };

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
                  <div className='col-lg-12 col-md-12 col-sm-12 col-xl-12'>
                    <div className='card overflow-hidden form_card top_card'>
                      <div className='card-body justify-content-between align-items-center d-flex flex-wrap'>
                        <div className='filter-left d-flex gap-x-2'>
                          {/* <ManagerDropdown managers={managers}/> */}

                          <DateFilter month={selectedMonth} />
                        </div>
                        <div className='team_colorBox'>
                        <ul>
                                    <li><span className="tenYear_bgColor box"></span>10+ years</li>
                                    <li><span className="Eight_tenbgColor box"></span>8-10 years</li>
                                    <li><span className="six_eightbgColor box"></span>6-8 years</li>
                                    <li><span className="four_sixbgColor box"></span>4-6 years</li>
                                    <li><span className="Two_fourbgColor box"></span>2-4 years</li>
                                    <li><span className="traineerbgColor box"></span>0.6- 2 years</li>
                                    <li><span className="OtherbgColor box"></span>0-6 months</li>
                                </ul>

                          {/* <ul>
                            <li>
                              <span className='ProjectManagerbg_color box'></span>
                              Project Manager
                            </li>
                            <li>
                              <span className='TeamLeadbg_color box'></span>Team
                              Lead
                            </li>
                            <li>
                              <span className='SoftwareEngbg_color box'></span>
                              Software Engineer
                            </li>
                            <li>
                              <span className='SrEngbg_color box'></span>Sr.
                              Senior Engineer
                            </li>
                            <li>
                              <span className='JrEngbg_color box'></span>Jr.
                              Software Engineer
                            </li>
                            <li>
                              <span className='Traineebg_color box'></span>
                              Trainee/Stipend
                            </li>
                            <li>
                              <span className='Otherbg_color box'></span>Others
                            </li>
                          </ul> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-box one-fourthBox'>
                  <div className='row'>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-xl-3 col-fourth'>
                      <div className='card overflow-hidden hrm-main-card primary'>
                        <div className='card-body'>
                          <div className='d-flex'>
                            <div className='me-3'>
                              <span className='avatar bg-primary'>
                                <i className='ri-team-line fs-18'></i>
                              </span>
                            </div>
                            <div className='flex-fill'>
                              <h6 className='mb-1 text-muted number-font fs-13'>
                                Total Employees
                              </h6>
                              <h3 className='mb-0 number-font'>
                                {projectsSummary?.totalEmployees??0}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                    <div className='col-lg-6 col-md-6 col-sm-12 col-xl-3 col-fourth'>
                      <div className='card overflow-hidden hrm-main-card danger'>
                        <div className='card-body'>
                          <div className='d-flex'>
                            <div className='me-3'>
                              <span className='avatar bg-danger'>
                                <i className='ti ti-wave-square fs-18'></i>
                              </span>
                            </div>
                            <div className='flex-fill'>
                              <h6 className='mb-1 text-muted number-font fs-13'>
                                Total Productive Percent
                              </h6>
                              <h3 className='mb-0 number-font'>{
                                  (projectsSummary?.productivityPercentage).toFixed(2)??0
                                }%</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                    <div className='col-lg-6 col-md-6 col-sm-12 col-xl-3 col-fourth'>
                      <div className='card overflow-hidden hrm-main-card blue'>
                        <div className='card-body'>
                          <div className='d-flex'>
                            <div className='me-3'>
                              <span className='avatar bg-blue'>
                                <i className='ri-time-line fs-18'></i>
                              </span>
                            </div>
                            <div className='flex-fill'>
                              <h6 className='mb-1 text-muted number-font fs-13'>
                                <Link
                                href={'/reports?tab=Work In Hand'}
                                >
                                     Work in Hand
                                </Link>
                           
                              </h6>
                              <h3 className='mb-0 number-font'> {numberToTimeConversion(
                                  projectsSummary?.workInHand??0
                                )}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-xl-3 col-fourth'>
                      <div className='card overflow-hidden hrm-main-card orange'>
                        <div className='card-body'>
                          <div className='d-flex'>
                            <div className='me-3'>
                              <span className='avatar bg-orange'>
                                <i className='ti ti-wave-square fs-18'></i>
                              </span>
                            </div>
                            <div className='flex-fill'>
                              <h6 className='mb-1 text-muted number-font fs-13'>
                              <Link
                                href={'/reports?tab=Payment Pending'}
                                >
                                     Pending Payment
                                </Link>
                                
                              </h6>
                              <h3 className='mb-0 number-font'>{numberToTimeConversion( projectsSummary?.pendingPayment??0)
                                  
                                }</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-xl-12'>
                    <div className='employee_list'>
                      {teamSummary?.map((teamLead: any) => (
                        <div
                          key={teamLead.teamLeadId}
                          className='card employee-card'
                        >
                          <div className='card-header flex-column'>
                            <div className='d-flex justify-content-between w-100'>
                              <Link
                                href={`/dashBoard/${teamLead.teamLeadId}`}
                                className='card-title number-font fs-15'
                              >
                                {teamLead.teamLeadName}
                              </Link>
                              <p className='mb-0 text-success number-font'>
                                +
                                {
                                  teamProductivity.filter(
                                    (item: any) =>
                                      item.teamLeadId == teamLead.teamLeadId
                                  )[0]?.productivityPercentage.toFixed(2)
                                }
                                %
                              </p>
                            </div>
                            <div className='d-flex justify-content-between w-100'>
                              <p className='mb-0 fs-12'>
                                Productive Hours:{' '}
                                {Math.round(
                                  teamProductivity.filter(
                                    (item: any) =>
                                      item.teamLeadId == teamLead.teamLeadId
                                  )[0]?.productivityHours
                                )}
                                /
                                {Math.round(
                                  teamProductivity.filter(
                                    (item: any) =>
                                      item.teamLeadId == teamLead.teamLeadId
                                  )[0]?.expectedProductivityHours
                                )}
                              </p>
                              <Link
                                className='mb-0 fs-11 number-font link_text'
                                href={`/dashBoard/${teamLead.teamLeadId}`}
                              >
                                <i className='ri-link'></i> Scrum
                              </Link>
                            
                            </div>
                          </div>
                          <CustomLinearProgress
                              value={
                                teamProductivity.find(
                                  (item: any) => item.teamLeadId === teamLead.teamLeadId
                                )?.productivityPercentage ?? 0
                              }
                            />
                          <div className='card-body'>
                          <div className="edit_teamLink">    
                                                  <Link className="mb-0 number-font link_text"  href='/assignTeam'><i className="ri-edit-line"></i> Edit Team</Link>
                                            </div>
                            <ul className='list-unstyled crm-top-deals mb-0'>
                             
                            {teamLead.teamMembers.map((member: any) => (
                                <li key={member.teamMemberId}>
                                  <div className='d-flex align-items-center flex-wrap'>
                                    <div className='me-2'>
                                      <span className='avatar avatar-sm avatar-rounded bg-transparent'>
                                        <span
                                          className={'avatar avatar-sm avatar-rounded  bg-danger-transparent fw-semibold'}
                                        >
                                          {member.teamMemberName
                                            .split(' ')
                                            .map((name: any[]) =>
                                              name[0]?.toUpperCase()
                                            )
                                            .join('')}
                                        </span>
                                      </span>
                                    </div>
                                    <div className='flex-fill'>
                                      <Link
                                        href={`/employees/${member.teamMemberId}`}
                                        className={`fw-semibold mb-0 fs-13 ${getDesignationNameClass(Number(member.teamMemberExperienceOnJoining))}`}
                                      >
                                        {member.teamMemberName}
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
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
      </div>
      <Footer />
    </div>
  );
};
export default Dashboard;