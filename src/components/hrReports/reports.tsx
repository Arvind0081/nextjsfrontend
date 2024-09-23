'use client';
import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
import ExportExcel from './exportExcel';
import MonthlyReports from './monthlyReports';
import DateFilter from './dateFilter';
import { useRouter } from 'next/navigation';

const Reports = ({ hrReportList, monthlyReports }: any) => {
    const [activeTab, setActiveTab] = useState<boolean>(true);
    const router = useRouter();

    const switchTab = () => {
        setActiveTab(true);
        router.push('/hrReports');
    };

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card custom-card">
                    <div className="card-body">
                        <div className="custm-tabs">
                            <ul
                                className="nav nav-tabs tab-style-1 d-sm-flex d-block mb-0"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab == true ? 'active' : ''}`}
                                        data-bs-toggle="tab"
                                        data-bs-target="#AttandanceReport"
                                        aria-current="page"
                                        aria-selected="true"
                                        role="tab"
                                        onClick={() => switchTab()}
                                    >
                                        Attendance Report
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab == false ? 'active' : ''}`}
                                        data-bs-toggle="tab"
                                        data-bs-target="#MonthlyReport"
                                        aria-selected="true"
                                        role="tab"
                                        onClick={() => setActiveTab(false)}
                                    >
                                        Monthly Report
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {activeTab ? (
                    <div className="custm-tabs">
                        <div className="tab-content">
                            <div
                                className="tab-pane active show"
                                id="AttandanceReport"
                                role="tabpanel"
                            >
                                <div className="card custom-card team_card">
                                    <div className="card-header justify-content-between awards_card_header">
                                        <div className="card-title">
                                            Attendance
                                        </div>
                                        <div className="filter-right d-flex gap-x-2">
                                            <DateFilter />
                                            <div className="btn-list mt-md-0 mt-2">
                                                <ExportExcel />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive attendance_table">
                                            <table className="border-primary hours-table table table-bordered text-nowrap attendance_layout">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">
                                                            Name
                                                        </th>
                                                        {hrReportList?.results[0]?.attendanceReports.map(
                                                            (data: any) => (
                                                                <th
                                                                    scope="col"
                                                                    key={
                                                                        data.day
                                                                    }
                                                                >
                                                                    {data.day}
                                                                </th>
                                                            )
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {hrReportList?.results?.map(
                                                        (item: any) => (
                                                            <tr
                                                                key={
                                                                    item.employeeNumber
                                                                }
                                                            >
                                                                <th>
                                                                    {
                                                                        item.employeeName
                                                                    }
                                                                    <div className="text-grey">
                                                                        {
                                                                            item.employeeNumber
                                                                        }
                                                                    </div>
                                                                </th>
                                                                {item.attendanceReports.map(
                                                                    (
                                                                        employeeDetail: any
                                                                    ) => (
                                                                        <td
                                                                            className={
                                                                                employeeDetail.attendanceStatus
                                                                            }
                                                                            key={
                                                                                employeeDetail.day
                                                                            }
                                                                        >
                                                                            {employeeDetail.attendanceStatus ===
                                                                            'H' ? (
                                                                                <div className="attendance_status_info">
                                                                                   <div className={`attendance_status Present_status ${employeeDetail.attendanceStatus === 'Ab' ? 'red' : ''}`}>
                                                                                 {employeeDetail.attendanceStatus}
                                                                           </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="attendance_status_info">
                                                                                    <div
                                                                                        className={`attendance_status ${employeeDetail.attendanceStatus}_status`}
                                                                                    >
                                                                                        {
                                                                                            employeeDetail.attendanceStatus
                                                                                        }
                                                                                    </div>
                                                                                    <div className="_BM_attendance">
                                                                                        <div className="attendance_status_3t">
                                                                                            <span className="threeT_info">
                                                                                                3t
                                                                                            </span>
                                                                                            <span className="threeT__attendance">
                                                                                                {
                                                                                                    employeeDetail.attendanceStatus
                                                                                                }
                                                                                            </span>
                                                                                            <span className="threeT-time">
                                                                                                {
                                                                                                    employeeDetail.dayHours
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="attendance_status_bm bg-white">
                                                                                            <span className="BM_info">
                                                                                                BM
                                                                                            </span>
                                                                                            <span className="BM__attendance bg-white">
                                                                                                N/A
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    )
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <MonthlyReports monthlyReports={monthlyReports} />
                )}
            </div>
        </div>
    );
};
export default Reports;