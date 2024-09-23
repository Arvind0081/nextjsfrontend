'use client';
// import { useRouter } from 'next/navigation';
import PaymentDateFilter from './paymentDateFilter';
import PaymentModuleStatusDropdown from './paymentModuleStatusDropdown';
import PaymentStatusDropdown from './paymentStatusDropdown';
import Link from 'next/link';

const PaymentPending = ({
  departmentId,
  paymentPendingReports,
  projectModuleStatus,
  projectPaymentsStatus,
}: any) => {
  // const router = useRouter();

  const numberToTimeConversion = (decimalTime: any) => {
    const hours = Math.floor(decimalTime);
    const fractionalHours = decimalTime - hours;
    const minutes = Math.round(fractionalHours * 60);

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  };
  const calculateTotalUpworkHours = (data: any) => {
    const upworkHours = data?.modulesList.reduce(
      (teamTotal: any, employee: any) => teamTotal + employee.approvedHours,
      0
    );
    return upworkHours;
  };
  const calculateTotalFixedHours = (data: any) => {
    const fixedHours = data?.modulesList.reduce(
      (teamTotal: any, employee: any) => teamTotal + employee.billingHours,
      0
    );
    // return data?.reduce((total: any, team: any) => {
    //     const teamFixedHours = team.employeeDetails.reduce(
    //         (teamTotal: any, employee: any) =>
    //             teamTotal + employee.fixedHours,
    //         0
    //     );
    //     return total + teamFixedHours;
    // }, 0);
    return fixedHours;
  };
  // const calculateTotalOfflineHours = (data: any) => {
  //     const offlineHours = data?.modulesList.reduce(
  //         (teamTotal: any, employee: any) =>
  //             teamTotal + employee.offlineHours,
  //         0
  //     );
  //     // return data?.reduce((total: any, team: any) => {
  //     //     const teamOfflineHours = team.employeeDetails.reduce(
  //     //         (teamTotal: any, employee: any) =>
  //     //             teamTotal + employee.offlineHours,
  //     //         0
  //     //     );
  //     //     return total + teamOfflineHours;
  //     // }, 0);
  //     return offlineHours;
  // };

  const calculateTotalBillingHours = (data: any) => {
    const billingHours = data?.modulesList?.reduce(
      (teamTotal: any, employee: any) => teamTotal + employee.leftHours,
      0
    );
    return billingHours;
  };

  const totalUpworkHours = (data: any) => {
    return numberToTimeConversion(calculateTotalUpworkHours(data));
  };
  // const totalOfflineHours = (data: any) => {
  //     return numberToTimeConversion(calculateTotalOfflineHours(data));
  // };

  const totalFixedHours = (data: any) => {
    return numberToTimeConversion(calculateTotalFixedHours(data));
  };
  const totalBillingHours = (data: any) => {
    return numberToTimeConversion(calculateTotalBillingHours(data));
  };
  // const handleModule = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //     const dep = event.target.value;
  //     router.push(`/upworkProfile?search=${dep}`);
  // };
  return (
    <div id='PaymentPending' role='tabpanel'>
      <div className='card custom-card team_card'>
        <div className='card-header justify-content-between awards_card_header'>
          <div className='card-title'>Payment Pending Report</div>
          <PaymentDateFilter />
        </div>
        {paymentPendingReports?.map((item: any, index: number) => (
          <div key={index} className='card-body'>
            <div className='table-responsive theme_table'>
              <table className='table text-nowrap table-hover border table-bordered'>
                <thead>
                  <tr>
                    <th scope='col' className='project-width'>
                      Project Name
                    </th>
                    <th scope='col' className='module-width'>
                      Module
                    </th>
                    {/* <th scope='col'>
                                                    Billing Type
                                                </th>
                                                <th scope='col'>
                                                    Hiring Status
                                                </th> */}
                    <th scope='col'>Deadline Date</th>
                    <th scope='col'>Approved Hours</th>
                    <th scope='col'>Billed Hours</th>
                    <th scope='col'>Left Hours</th>
                    <th scope='col'>Module Status</th>
                    <th scope='col'>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {item.modulesList.map((moduleItem: any, moduleIndex: any) => (
                    <tr key={moduleIndex}>
                      {/* <td>{item.projectName}</td> */}
                      <Link href={`/projects/${item.projectId}`} className='btn-link' >
                       
                       
                     
                        {item.projectName}
                      </Link>
                      <td>{moduleItem.moduleName}</td>
                      {/* <td>
                                                    {moduleItem.billingType}
                                                </td>
                                                <td>
                                                    {moduleItem.hiringStatus}
                                                </td> */}
                      <td>{moduleItem.deadlineDate}</td>
                      <td className='text-success'>
                        {moduleItem.approvedHours}
                      </td>
                      <td className='text-success text-bold'>
                        <b>{moduleItem.billingHours}</b>
                      </td>
                      <td className='text-danger'>{moduleItem.leftHours}</td>
                      <td>
                        <PaymentModuleStatusDropdown
                          projectModuleStatus={projectModuleStatus}
                          departmentId={departmentId}
                          selectedStatus={moduleItem.moduleStatus}
                          moduleId={moduleItem.moduleId}
                        />
                      </td>
                      <td>
                        <PaymentStatusDropdown
                          projectPaymentsStatus={projectPaymentsStatus}
                          departmentId={departmentId}
                          selectedStatus={moduleItem.paymentStatus}
                          moduleId={moduleItem.moduleId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className='text-bold'>
                      Total Hours
                    </td>

                    <td>{totalUpworkHours(item)}</td>
                    <td className='text-success text-bold'>
                      <b>{totalFixedHours(item)}</b>
                    </td>

                    <td>
                      <span className='text-danger'>
                        <b>{totalBillingHours(item)}</b>
                      </span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PaymentPending;
