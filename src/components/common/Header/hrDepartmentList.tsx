'use client';
import Department from '@/components/hrDashBoard/departmentDropdown';
import { usePathname } from 'next/navigation';
const HRDepartmentList = ({ getDepartment, getManagerList }: any) => {
  const url = usePathname();
  const isValidUrl =
    url == '/hrEmployeesBoard'
      ? true
      : url == '/hrReports'
        ? true
        : url == '/hrDashBoard'
          ? true
            : url == '/dashBoard'
              ? true
              : false;

  return (
    <>
      {isValidUrl && (
        <Department
          getDepartment={getDepartment}
          getManagerList={getManagerList}
        />
      )}
    </>
  );
};
export default HRDepartmentList;
