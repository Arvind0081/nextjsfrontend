'use client';
import { updatePaymentStatus } from '@/utils/publicApi';
import { UpdatePaymentReq } from '@/utils/types'; // Adjusted type import
import { useRouter } from 'next/navigation';

const UpdatePaymentStatus = ({ invoice, payment }: any) => {
  const router = useRouter();

  const handleEmployeeStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: any
  ) => {
    
    const status =Number(event.target.value);
  
    const UpdateReq: UpdatePaymentReq = {
      id: id,

      paymentStatus: status,
    };

    await updatePaymentStatus(UpdateReq);

    router.refresh();
  };

  return (
    <select
      className='form-control w150'
      value={invoice?.paymentStatus}
      onChange={(e) => handleEmployeeStatusChange(e, invoice?.id)}
    >
      {payment.map((option: any, index: number) => (
        <option key={index} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
};

export default UpdatePaymentStatus;
