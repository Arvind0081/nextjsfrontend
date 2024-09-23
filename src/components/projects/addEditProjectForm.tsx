'use client';
import apiService from '@/services/apiService';
import {
  BillingTypeModel,
  ClientModel,
  HiringModel,
  ProjectMembersModel,
  StatusModel,
  addEditProjectFormValue,
} from '@/utils/types';
import React, { useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useForm,Controller  } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import getUser from '@/utils/getUserClientSide';
import { Dropdown } from 'semantic-ui-react';

const ProjectAddEditForm = ({
  addEdit,
  setAddEdit,
  selectedProject,
  setSelectedProject,
  hiringType,
  clientList,
  projectStatusData,
  billingType,members,salesPerson
}: any | null) => {
  const router = useRouter();
  const token: any = getUser();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<addEditProjectFormValue>();

  useEffect(() => {
  
    if (selectedProject) {
      reset(selectedProject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  const handleAddEditProject = async (data: addEditProjectFormValue) => {

    const payLoad = {
      ...data,
      id: selectedProject ? selectedProject?.id : 0,
      clientId: Number(data.clientId),
      clientName: clientList.filter(
        (client: ClientModel) => client.id === Number(data.clientId)
      )[0].name,
      createdBy: selectedProject ? selectedProject.createdBy : token.id,
      updatedBy: selectedProject ? token.id : '',
      createdTime: selectedProject ? selectedProject?.createdTime : new Date(),
      isBilling: Number(data.isBilling),
      hiringStatus: Number(data.hiringStatus),
      isActive: selectedProject ? selectedProject?.isActive : 0,
      projectStatus: Number(data.projectStatus),
      invoiceProjectID: selectedProject
        ? selectedProject?.invoiceProjectID
        : '',
        departmentId: Number(token.departmentId),
       // salesPerson:data.salesPerson,
       // skills: data.skills,
    };

    if (data?.id) {
      await apiService.put('/Project/UpdateProject', payLoad);
      router.refresh();
      handleHideCanvas();
    } else {
      await apiService.post('/Project/AddProject', payLoad);
      router.refresh();
      handleHideCanvas();
    }
  };

  const handleHideCanvas = () => {
    setAddEdit(false);
    if (selectedProject) setSelectedProject(null);
    reset();
  };

   // Options for the dropdown
   const memberOptions = members?.map((member:ProjectMembersModel) => ({
    key: member.id,
    text: member.name,
    value: member.id
  }));

  return (
    <Offcanvas show={addEdit} onHide={() => handleHideCanvas()} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {selectedProject ? 'Update Project' : 'Add New Project'}
        </Offcanvas.Title>
        <button
          type='button'
          className='btn-close text-reset text-right'
          onClick={() => handleHideCanvas()}
        >
          <i className='fe fe-x fs-18'></i>
        </button>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form
          className='status-repeat-box row m-0'
          onSubmit={handleSubmit(handleAddEditProject)}
        >
          <div className='col-md-12 form-group'>
            <label htmlFor='name'>Project Name</label>
            <input
              id='projectName'
              type='text'
              className='form-control'
              {...register('name', {
                required: 'Project Name is required',
              })}
            />
            {errors.name && (
              <div className='validation_error'>
                <span role='alert'>{errors.name.message}</span>
              </div>
            )}
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='hiringStatus'>Hiring Status</label>
            <select
              id='hiringStatus'
              className='form-control'
              {...register('hiringStatus', {
                required: 'Hiring Status is required',
              })}
            >
              <option value=''> Select</option>
              {hiringType?.map((item: HiringModel) => (
                <option key={item.value} value={item.value}>
                  {' '}
                  {item.text}
                </option>
              ))}
            </select>
            {errors.hiringStatus && (
              <div className='validation_error'>
                <span role='alert'>{errors.hiringStatus.message}</span>
              </div>
            )}
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='clientId'>Client Name</label>
            <select
              id='clientId'
              className='form-control'
              {...register('clientId', {
                required: 'Client Name is required',
              })}
            >
              <option value=''> Select</option>
              {clientList?.map((item: ClientModel) => (
                <option key={item.id} value={item.id}>
                  {' '}
                  {item.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <div className='validation_error'>
                <span role='alert'>{errors.clientId.message}</span>
              </div>
            )}
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='projectStatus'>Status</label>
            <select
              id='projectStatus'
              className='form-control'
              {...register('projectStatus', {
                required: 'Status is required',
              })}
            >
              <option value=''> Select</option>
              {projectStatusData?.map((item: StatusModel) => (
                <option key={item.value} value={item.value}>
                  {' '}
                  {item.text}
                </option>
              ))}
            </select>
            {errors.projectStatus && (
              <div className='validation_error'>
                <span role='alert'>{errors.projectStatus.message}</span>
              </div>
            )}
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='isBilling'>Billing Type</label>
            <select
              id='isBilling'
              className='form-control'
              {...register('isBilling', {
                required: 'Billing Type is required',
              })}
            >
              <option value=''> Select</option>
              {billingType?.map((item: BillingTypeModel) => (
                <option key={item.value} value={item.value}>
                  {' '}
                  {item.text}
                </option>
              ))}
            </select>
            {errors.isBilling && (
              <div className='validation_error'>
                <span role='alert'>{errors.isBilling.message}</span>
              </div>
            )}
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='productionUrl'>Production Url</label>
            <input
              id='productionUrl'
              type='text'
              className='form-control'
              {...register('productionUrl')}
            />
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='stageUrl'>Dev/Stage Url</label>
            <input
              id='stageUrl'
              type='text'
              className='form-control'
              {...register('stageUrl')}
            />
          </div>
          <div className='col-md-12 form-group'>
            <label htmlFor='employeeList'>Project Assign List </label>
            <Controller
          name="employeeList"
          control={control}
         // rules={{ required: 'Member is required' }}
          render={({ field }) => (
            <Dropdown
              id='employeeList'
              placeholder='Select members'
              fluid
              multiple
              selection
              options={memberOptions}
              onChange={(e, { value }) => field.onChange(value)}
              value={field.value || []}
            />
          )}
        />
            {/* {errors.employeeList && (
              <div className='validation_error'>
                <span role='alert'>{errors.employeeList.message}</span>
              </div>
            )} */}
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='skills'>Technology Set</label>
            <input
              id='skills'
              type='text'
              className='form-control'
              {...register('skills')}
            />
          </div>
          <div className='col-md-6 form-group'>
            <label htmlFor='salesPerson'>Assign Sale Person</label>
            <select
              id='salesPerson'
              className='form-control'
              {...register('salesPerson', {
                required: 'Sales Person is required',
              })}
            >
              <option value=''> Select</option>
              {salesPerson.map((department:any,index:number) => (
                    <optgroup key={index} label={department.departmentName}>
                        {department.salesPersons.map((person:any) => (
                            <option key={person.id} value={person.id}>{person.name}</option>
                        ))}
                    </optgroup>
                ))}
            </select>
            {/* {errors.isBilling && (
              <div className='validation_error'>
                <span role='alert'>{errors.isBilling.message}</span>
              </div>
            )} */}
          </div>
          <div className='col-md-12 form-group'>
            <label htmlFor='description'>Description </label>
            <textarea
              id='description'
              className='form-control h50'
              {...register('description', {
                required: 'Description is required',
              })}
            ></textarea>
            {errors.description && (
              <div className='validation_error'>
                <span role='alert'>{errors.description.message}</span>
              </div>
            )}
          </div>
          <div className="col-md-12 form-group">
                                        <label htmlFor='inter' className="custom-control custom-checkbox mb-0">                                     
            <input
              id='inter'
             type="checkbox"
              className='custom-control-input'
              // {...register('inter', {
              //   required: 'Project Name is required',
              // })}
            />
                                            <span className="custom-control-label">Inter Departmental</span>
                                        </label>
                                    </div>
          <div className='col-md-12 form-group'>
            <label htmlFor='notes'>Important Notes </label>
            <textarea
              id='notes'
              className='form-control h100'
              {...register('notes')}
            ></textarea>
          </div>
          <div className='offcanvas-footer text-right'>
            <input
              type='submit'
              value={selectedProject ? ' Update' : 'Add Project'}
              className='btn btn-primary'
            />
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProjectAddEditForm;
