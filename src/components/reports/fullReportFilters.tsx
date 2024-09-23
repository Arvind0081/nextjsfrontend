'use client'

import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter,usePathname, useSearchParams } from 'next/dist/client/components/navigation';
import FullExcelReport from './fullReportDateFilter';


const FullReportFiter=({employeeList,projects,clients}:any)=>{
    //Initialize hook
    const router = useRouter();
    const url = usePathname();
    const searchParams = useSearchParams();

    //Get Params
    const activeTab = searchParams.get('tab');
     let today = new Date();
    let startDate = format(
        new Date(today.setDate(today.getDate() - 6)),
        'yyyy-MM-dd'
    );
    let endDate = format(new Date(), 'yyyy-MM-dd');
    //Declare State
    const [currentHoursFrom, setCurrentHoursFrom] = useState<any>(startDate);
    const [currentHoursTo, setCurrentHoursTo] = useState<any>(endDate);

    const handleHoursFrom = (e: any) => {
        const months = e.target.value;

        setCurrentHoursFrom(e.target.value);
        router.push(
            `${url}?tab=${activeTab}&hoursFrom=${months}&hoursTo=${currentHoursTo}`
        );
    };
    const handleHoursTo = (e: any) => {
        const hours = e.target.value;
        setCurrentHoursTo(e.target.value);
        router.push(
            `${url}?tab=${activeTab}&hoursFrom=${currentHoursFrom}&hoursTo=${hours}`
        );
    };


    const handleEmployeeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const emp = event.target.value;
        router.push(
            `${url}?tab=${activeTab}&EmployeeId=${emp}`
        );
      };

      const handleProjectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const project = event.target.value;
        router.push(
            `${url}?tab=${activeTab}&ProjectId=${project}`
        );
      };


      const handleClientChange = (
        event: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const client = event.target.value;
        router.push(
            `${url}?tab=${activeTab}&ClientId=${client}`
        );
      };

    return(
         <div className='card-header justify-content-between awards_card_header'>
            <div className='filter-left d-flex gap-x-2'>
                <div className='selectbox select_designation'>
                <select className='form-control' onChange={handleEmployeeChange}>
                        <option value=''>Select Employee</option>
                        {employeeList?.map((employee: any) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='selectbox select_designation'>
                    <select className='form-control' onChange={handleProjectChange}>
                        <option value=''>Select Project</option>
                        {projects.map((project: any) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='selectbox select_designation me-2'>
                    <select className='form-control' onChange={handleClientChange}>
                        <option value=''>Select Client</option>
                        {clients.map((client: any) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='align-items-end d-flex gap-x-2 selectbox'>
                    <p className='fw-semibold mb-2'>From:</p>
                    <div className='input-group date-selectbox'>
                       <input
                        type='date'
                        className='form-control'
                        value={currentHoursFrom ?? startDate}
                        onChange={handleHoursFrom}
                    />
                      
                    </div>
                </div>
                
                <div className='align-items-end d-flex gap-x-2 selectbox'>
                    <p className='fw-semibold mb-2'>To:</p>
                    <div className='input-group date-selectbox'>
                        <input
                        type='date'
                        className='form-control'
                        value={currentHoursTo ?? endDate}
                        onChange={handleHoursTo}
                    />
                       
                    </div>
                </div>
            </div>
            <FullExcelReport />
        </div>
    )
}
export default FullReportFiter;