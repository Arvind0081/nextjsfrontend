'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AddToDoPayloadModel, TeamToDoModel, todoParam } from '@/utils/types';
import { addToDoList, teamsToDo } from '@/utils/publicApi';
import getUser from '@/utils/getUserClientSide';

const ToDoManager = () => {
  const [teamToDoList, setTeamToDoList] = useState<TeamToDoModel[]>([]);
  const [localToDos, setLocalToDos] = useState<{ [key: string]: string }>({});
  const [teamLeadToDos, setTeamLeadToDos] = useState<{ [key: string]: string }>({});
  const [teamLeadNames, setTeamLeadNames] = useState<{ [key: string]: string }>({}); // Mapping for team lead names
  const [teamLeadIds, setTeamLeadIds] = useState<Set<string>>(new Set()); // Set of team lead IDs

  const token: any = getUser();

  // Fetch team To-Do list
  const getTeamToDo = useCallback(async () => {

    const data: todoParam = {
      departmentId: token.departmentId
    };

    try {
      const response = await teamsToDo(data);
      setTeamToDoList(response);

      // Extract team lead IDs
      const teamLeadIdSet = new Set<string>(
        response
          .filter(member => member.teamLeadId)
          .map(member => member.teamLeadId as string)
      );
      setTeamLeadIds(teamLeadIdSet);

      const initialToDos = response.reduce((acc, member) => {
        acc[member.employeeId] = member?.toDoList?.name || '';
        return acc;
      }, {} as { [key: string]: string });

      const initialTeamLeadToDos = response.reduce((acc, member) => {
        if (member.teamLeadId === null) {
          acc[member.employeeId] = member?.toDoList?.name || '';
        }
        return acc;
      }, {} as { [key: string]: string });

      const initialTeamLeadNames = response.reduce((acc:any, member:any) => {
        if (member.teamLeadId && member.teamLeadName) {
          acc[member.teamLeadId] = member.teamLeadName;
        }
        return acc;
      }, {} as { [key: string]: string });

      setLocalToDos(initialToDos);
      setTeamLeadToDos(initialTeamLeadToDos);
      setTeamLeadNames(initialTeamLeadNames);
    } catch (error) {
      console.error('Error fetching team ToDo list:', error);
    }
  }, [token.departmentId]);

  useEffect(() => {
    getTeamToDo();
  }, [getTeamToDo]);

  // Handle To-Do list saving
  const handleToDoList = async (id: string, isTeamLead: boolean = false) => {
    const newValue = isTeamLead ? teamLeadToDos[id] : localToDos[id];
    const payload: AddToDoPayloadModel = {
      toDo: newValue,
      assignedToId: id,
    };
    console.log('Saving ToDo for:', id, 'Payload:', payload); // Debugging
    try {
      await addToDoList(payload);
    } catch (error) {
      console.error('Error saving ToDo:', error);
    }
  };

  // Handle change in textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string, isTeamLead: boolean = false) => {
    if (isTeamLead) {
      setTeamLeadToDos(prev => ({
        ...prev,
        [id]: e.target.value,
      }));
    } else {
      setLocalToDos(prev => ({
        ...prev,
        [id]: e.target.value,
      }));
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    getTeamToDo();
  };

  // Group data by team lead
  const groupedData = teamToDoList?.reduce((acc, item) => {
    const teamLeadId = item.teamLeadId || 'Unassigned';
    if (!acc[teamLeadId]) {
      acc[teamLeadId] = [];
    }
    acc[teamLeadId].push(item);
    return acc;
  }, {} as { [key: string]: TeamToDoModel[] });

  // Extract unassigned employees
  const unassignedEmployees = groupedData['Unassigned']?.filter(member => !teamLeadIds.has(member.employeeId)) || [];
  delete groupedData['Unassigned'];

  return (
    <div className="main-container container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card custom-card team_card">
            <div className="card-header justify-content-between">
              <div className="card-title">{'To do\'s'}</div>
              <div className="mb-2">
                <i onClick={handleRefresh} className="bi bi-arrow-clockwise fs-18"></i>
              </div>
            </div>
            <div className="card-body">
              <div className="todo_layout">
                {Object.keys(groupedData).map((teamLeadId) => (
                  teamLeadId !== 'Unassigned' && (
                    <div key={teamLeadId} className="todo_content">
                      <div className="card-header justify-content-between">
                        <div className="card-title">{`${teamLeadNames[teamLeadId] || teamLeadId}'s Team`}</div>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label className="f14 fw-semibold mb-1">{teamLeadNames[teamLeadId] || teamLeadId}</label>
                          <textarea
                            onBlur={() => handleToDoList(teamLeadId, true)} // Save on blur
                            onChange={(e) => handleChange(e, teamLeadId, true)}
                            placeholder="Team Lead To-Do's"
                            value={teamLeadToDos[teamLeadId] || ''}
                            className="form-control h100 resize-none"
                          />
                        </div>
                        {groupedData[teamLeadId].map((member) => (
                          <div key={member.employeeId} className="form-group">
                            <label className="f14 fw-semibold mb-1">{member.employeeName}</label>
                            <textarea
                              onBlur={() => handleToDoList(member.employeeId)} // Save on blur
                              onChange={(e) => handleChange(e, member.employeeId)}
                              placeholder="To-Do's"
                              value={localToDos[member.employeeId] || ''}
                              className="form-control h100 resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
                {unassignedEmployees.length > 0 && (
                  <div className="todo_content">
                    <div className="card-header justify-content-between">
                      <div className="card-title">Unassigned</div>
                    </div>
                    <div className="card-body">
                      {unassignedEmployees.map((member) => (
                        <div key={member.employeeId} className="form-group">
                          <label className="f14 fw-semibold mb-1">{member.employeeName}</label>
                          <textarea
                            onBlur={() => handleToDoList(member.employeeId)} // Save on blur
                            onChange={(e) => handleChange(e, member.employeeId)}
                            placeholder="To-Do's"
                            value={localToDos[member.employeeId] || ''}
                            className="form-control h100 resize-none"
                          />
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
  );
};

export default ToDoManager;
