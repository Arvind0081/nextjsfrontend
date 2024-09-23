'use client'
import React,{useState} from 'react'
import ProjectAddEditForm from './addEditProjectForm';
import { ProjectInfoModel } from '@/utils/types';
import { individualProject } from '@/utils/publicApi';
const EditProject=({id,projectStatusData,hiringType,billingType,clientList,paginationData,members}:any)=>{
  const [addEdit,setAddEdit]=useState(false);
  const [selectedProject,setSelectedProject]=useState<ProjectInfoModel>();

const  handleClick=async()=>{
      const response =await individualProject(id);
      if(response){
          setSelectedProject(response);
          setAddEdit(true);
      }
  };
    return (
        <div className='btn-list mt-md-0'>
      <button type="button" className="btn btn-primary btn-wave"  onClick={() =>handleClick()}>
      <i className="bi bi-pencil-square"></i>Edit Project</button>                                         
       

      <ProjectAddEditForm addEdit={addEdit} setAddEdit={setAddEdit} selectedProject={selectedProject} setSelectedProject={setSelectedProject} projectStatusData={projectStatusData} hiringType={hiringType} billingType={billingType} clientList={clientList} paginationData={paginationData} members={members}/>
       
    </div>
    )
}

export default EditProject;