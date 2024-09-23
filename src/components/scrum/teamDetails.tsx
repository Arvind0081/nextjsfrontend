'use client'
import { ScrumTeamPerFormanceResponseModel } from '@/utils/types';
import Link from 'next/link';
import React,{useState,useEffect} from 'react';
import getUser from '@/utils/getUserClientSide';
import EmployeeProgressDetailsButton from '@/components/dashboard/employeeProgressDetailsButton';
const ScrumTeamDetails=({teamPerformance,payLoad,employeeDetails}:any)=>{

    const user: any = getUser();

    const [searchValue,setSearchValue]=useState('');
    const[debounceSearchValue,setDebounceSearchValue]=useState('');
    const [teamDetails,setTeamDetails]=useState<any[]>([]);
    const numberToTimeConversion = (decimalTime: any) => {
        const hours = Math.floor(decimalTime);
        const fractionalHours = decimalTime - hours;
        const minutes = Math.round(fractionalHours * 60);
    
        // Format time string to HH:mm
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formattedTime;
      };

      useEffect(()=>{setTeamDetails(teamPerformance);}
      
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ,[]);


      
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebounceSearchValue(searchValue);
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
}, [searchValue]);

useEffect(() => {
    handleSearch();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [debounceSearchValue]);

      const handleSearch=()=>{
    
        if(debounceSearchValue){
            const data=teamPerformance.filter((item:ScrumTeamPerFormanceResponseModel)=> item.name.toLocaleLowerCase().includes(debounceSearchValue.toLocaleLowerCase()));
            setTeamDetails(data);
        }else{
            setTeamDetails(teamPerformance);
        }
      };

      const totalUpworkHours=()=>{
        return numberToTimeConversion(
            teamDetails?.map((item: ScrumTeamPerFormanceResponseModel) => item.upworkHours)
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

      const totalFixedHours=()=>{
        return numberToTimeConversion(
            teamDetails?.map((item: ScrumTeamPerFormanceResponseModel) => item.fixedHours)
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

      const totalBilledHours=()=>{
        return numberToTimeConversion(
            teamDetails?.map((item: ScrumTeamPerFormanceResponseModel) =>(item.upworkHours + item.fixedHours))
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

      const totalNonBilledHours=()=>{
        return numberToTimeConversion(
            teamDetails?.map((item: ScrumTeamPerFormanceResponseModel) =>item.nonBillableHours)
              .reduce((a: number, b: number) => a + b, 0)
          );
      };

    return(
<div className="row">
<div className="col-xl-12">
    <div className="card custom-card team_card">
        <div className="card-header justify-content-between awards_card_header">
            <div className="card-title">{employeeDetails.firstName}{' '}{employeeDetails.lastName}`s Team</div>
            <div className="filter-right">
                <div className="search_box">
                    <i className="ri-search-line"></i>
                    <input className="form-control form-control-sm" type="text"
                        placeholder="Search Here" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
                </div>
            </div>
        </div>
        <div className="card-body">
            <div className="table-responsive theme_table ">
               
                <table
                    className="table text-nowrap table-hover border table-bordered">
                    <thead>
                        <tr>
                            <th>Developer Name</th>
                            <th scope="col">Upwork Hours</th>
                            <th scope="col">Fixed Billing Hours</th>
                            <th scope="col">Billing Hours</th>
                            <th scope="col">Non Billable Hours</th>
                            <th scope="col">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                       {teamDetails?.map((item:ScrumTeamPerFormanceResponseModel)=>(
                        <tr key={item.employeeId}>
                        <td><Link href={user?.id===item.employeeId?'/profile':`/employees/${item.employeeId}`}>{item.name}</Link></td>
                        <td>{numberToTimeConversion(item.upworkHours)}</td>
                        <td>{numberToTimeConversion(item.fixedHours)}</td>
                        <td className="text-success text-bold">
                            <b>{numberToTimeConversion(item.upworkHours + item.fixedHours)}</b>
                        </td>
                        <td><span className="text-danger">{numberToTimeConversion(item.nonBillableHours)}</span></td>
                        <td>
                            <EmployeeProgressDetailsButton id={item.employeeId} payLoad={payLoad} name={item.name}/>
                        </td>
                    </tr>
                       ))}
                       
                    </tbody>
                    <tfoot>
                        <tr>
                           <td className="text-bold">Total </td>
                           <td>{totalUpworkHours()}</td>
                           <td>{totalFixedHours()}</td>
                           <td className="text-success text-bold"><b>{totalBilledHours()}</b></td>
                           <td className="text-danger">{totalNonBilledHours()}</td>
                           <td></td>
                        </tr>
                     </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>
</div>
    )
}

export default ScrumTeamDetails;















