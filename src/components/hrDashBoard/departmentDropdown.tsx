'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const Department = ({ getDepartment, getManagerList }: any) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const url = usePathname();

    const searchValue = searchParams.get('departmentId');
    const managerIdSearch = searchParams.get('managerId');

    const handleDepartmentChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const dep = event.target.value;
        // Reset managerId to empty when department changes
        router.push(`${url}?departmentId=${dep}&managerId=`);
    };

    const handleManagerChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newManagerId = event.target.value;
        router.push(
            `${url}?departmentId=${searchValue ?? 1}&managerId=${newManagerId}`
        );
    };

    return (
        <>
        <div className='d-flex department_Header'>
            <div className="selectbox">
                <p className="fw-semibold mb-2">Select Department</p>
                <select
                    className="form-control"
                    value={searchValue ?? 1}
                    onChange={handleDepartmentChange}
                >
                    {getDepartment?.map((item: any) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="selectbox">
                <p className="fw-semibold mb-2">Select Manager</p>
                <select
                    className="form-control"
                    value={managerIdSearch ?? ''} // Change to value to ensure it resets
                    onChange={handleManagerChange}
                >
                    <option value="">Select Manager</option>
                    {getManagerList?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        </>
    );
};

export default Department;
