'use client'
import apiService from '@/services/apiService';
import { useRouter } from 'next/navigation';
const DeleteBadge = ({ data, badge }: any) => {
    const router=useRouter();
  const handleDelete = async (employeeId: number, badgeId: number) => {
  
    try {
      const response = await apiService.delete(
        `/Employee/DeleteAssignAwards?employeeId=${employeeId}&badgeId=${badgeId}`
      );
      console.log('Record deleted successfully', response.mesasge);
      router.refresh();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  return (
    <>
      <i
        className='bi bi-x-circle text-red'
        onClick={() => handleDelete(data, badge)} 
        style={{ cursor: 'pointer' }} 
      ></i>
    </>
  );
};
export default DeleteBadge;
