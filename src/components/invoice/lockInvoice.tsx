'use client';
import React, { useState, useEffect } from 'react';
import { updateLockStatus } from '@/utils/publicApi';
import { LockStatus } from '@/utils/types'; 
import { useRouter } from 'next/navigation';

interface LockInvoiceProps {
  id: number; 
  initialStatus: boolean; 
}

const LockInvoice: React.FC<LockInvoiceProps> = ({ id, initialStatus }) => {
  const [isLocked, setIsLocked] = useState<boolean>(initialStatus); 
  const router = useRouter();


  useEffect(() => {

  }, [id]);

  const handleStatusChange = async () => {
    const newStatus = !isLocked; 

    const updateReq: LockStatus = {
      id: id,
      status: newStatus,
    };

    try {
      console.log('Sending request to update status to:', newStatus); 
      await updateLockStatus(updateReq);
      setIsLocked(newStatus); 
      console.log('Status updated locally to:', newStatus);
      router.refresh(); 
    } catch (error) {
      console.error('Failed to update lock status:', error);
    }
  };

  return (
    <i
      className={`bi ${isLocked ? 'bi-lock ' : 'bi-unlock'}`}
      onClick={handleStatusChange}
      style={{ cursor: 'pointer' }}
    ></i>
  );
};

export default LockInvoice;
