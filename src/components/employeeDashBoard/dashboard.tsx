'use client';
import React, { useState, useEffect } from 'react';
import AddStatusButton from '@/components/myStatus/addStatusButton';
import Link from 'next/link';
import Image from 'next/image';
import PerformanceChart from './performanceChart';
import { useRouter } from 'next/navigation';
import { addToDoList } from '@/utils/publicApi';
import { AddToDoPayloadModel } from '@/utils/types';

const Dashboard = ({
  dashboardList,
  empProjectList,
  empProfileList,
  user,
  assignedTask,
}: any) => {
  const [currentMonth, setCurrentMonth] = useState('');
  const router = useRouter();
  const [toDo, setToDo] = useState(assignedTask);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    setCurrentMonth(`${year}-${month}`);
  }, []);

  const handleMonthChange = (e: any) => {
    const month = e.target.value;
    setCurrentMonth(month);
    router.push(`/employeeDashBoard?month=${month}`);
  };

  const handleToDoList = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    setToDo(e.target.value);
    const payload: AddToDoPayloadModel = {
      toDo: e.target.value,
      assignedToId: id,
    };

    await addToDoList(payload);
  };

  const badgeCounts = dashboardList?.employeeBadges?.reduce(
    (acc: any, badge: any) => {
      const key = badge.badgeImage; // Use badgeImage as the key
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );

  const uniqueBadges = Array.from(
    new Set(
      dashboardList?.employeeBadges?.map((badge: any) => badge.badgeImage)
    )
  ).map((badgeImage: any) => ({
    badgeImage,
    count: badgeCounts[badgeImage],
  }));

  return (
    <div className='main-content app-content mt-0'>
      <div className='side-app'>
        <div className='main-container container-fluid'>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xl-12'>
              <div className='card overflow-hidden form_card top_card'>
                <div className='card-body justify-content-between align-items-center d-flex flex-wrap'>
                  <div className='filter-left'>
                    <div className='selectbox'>
                      <p className='fw-semibold mb-2'>Select Month</p>
                      <div className='input-group'>
                        <input
                          type='month'
                          className='form-control'
                          value={currentMonth}
                          onChange={handleMonthChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='btn-list mt-md-0 mt-2 filter-right'>
                    <AddStatusButton
                      projectsListFromDb={empProjectList}
                      upwokProfileListFromDb={empProfileList}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-12'>
              <div className='card custom-card team_card'>
                <div className='card-header justify-content-between awards_card_header'>
                  <div className='card-title'>
                    Attendance For{' '}
                    {new Date(currentMonth).toLocaleString('default', {
                      month: 'long',
                    })}
                  </div>
                  <div className='dashboard-awards top_card_awards mb-4'>
                    {uniqueBadges.map((badge, index) => (
                      <div key={index} className='mr-3 relative'>
                        <Image
                          src={`data:image/png;base64,${badge.badgeImage}`} // Ensure the correct MIME type (png or jpeg)
                          width={150}
                          height={150}
                          alt={`award_${index}`}
                        />
                        {badge.count > 1 && (
                          <div className='absolute top-[-8px] right-[-6px] bg-red-600 text-white text-xs px-1 py-0.9 rounded'>
                            {badge.count}
                          </div>
                        )}
                      </div>
                    ))}
                    <Link className='header-brand1' href='/profile'>
                      View All
                    </Link>
                  </div>
                </div>

                <div className='card-body'>
                  <div className='table-responsive attendance_table'>
                    <table className='border-primary hours-table table table-bordered text-nowrap attendance_layout'>
                      <thead>
                        <tr>
                          <th scope='col'>Name</th>
                          {dashboardList?.attendanceList?.map(
                            (_: any, index: number) => (
                              <th scope='col' key={index + 1}>
                                {index + 1}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{user.unique_name}</th>
                          {dashboardList?.attendanceList?.map(
                            (attendance: any, index: number) => (
                              <td key={index} className='present'>
                                {attendance.attendanceStatus ? (
                                  <div className='attendance_status_info'>
                                    <div
                                      className={`attendance_status Present_status ${attendance.attendanceStatus === 'Ab' ? 'red' : ''}`}
                                    >
                                      {attendance.attendanceStatus}
                                    </div>
                                    {attendance.attendanceStatus !== 'H' && (
                                      <div className='_BM_attendance'>
                                        <div className='attendance_status_3t'>
                                          <span className='threeT_info'>
                                            3t
                                          </span>
                                          <span className='threeT__attendance'>
                                            {attendance.attendanceStatus}
                                          </span>
                                          <span className='threeT-time'>
                                            {attendance.dayHours}
                                          </span>
                                        </div>
                                        <div className='attendance_status_bm bg-white'>
                                          <span className='BM_info'>BM</span>
                                          <span className='BM__attendance bg-white'>
                                            N/A
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  // Show -- when attendanceStatus is null
                                  <div className='attendance_status_info'>
                                    <div className='attendance_status Present_status'>
                                      --
                                    </div>
                                  </div>
                                )}
                              </td>
                            )
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-xl-6'>
              <div className='card custom-card'>
                <div className='card-header justify-content-between'>
                  <div className='card-title'>
                    Your This Month Performance Chart
                  </div>
                </div>
                <PerformanceChart dashboardList={dashboardList} />
              </div>
            </div>
            <div className='col-xl-6'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='card custom-card team_card'>
                    <div className='card-header justify-content-between'>
                      <div className='card-title'>To do`s </div>
                    </div>
                    <div className='card-body'>
                      <textarea
                        onBlur={(e) => handleToDoList(e, user.id)}
                        placeholder='To-Do`s'
                        className='form-control h100 resize-none'
                      >
                        {toDo}
                      </textarea>
                    </div>
                  </div>
                  <div className='card custom-card team_card'>
                    <div className='card-header justify-content-between'>
                      <div className='card-title'>My Showcase Projects</div>
                    </div>
                    <div className='card-body'>
                      <ul className='list-unstyled mb-0 showcase-project-list'>
                        {dashboardList?.userProjects?.map(
                          (project: any, index: number) => (
                            <li className='warning' key={index}>
                              {project.name}
                            </li>
                          )
                        )}
                      </ul>
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

export default Dashboard;
