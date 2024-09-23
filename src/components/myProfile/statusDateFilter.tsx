'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const StatusDateFilter = () => {
    const [currentMonth, setCurrentMonth] = useState('');
    const router = useRouter();
    const handleMonthChange = (e: any) => {
        const month = e.target.value;
        setCurrentMonth(e.target.value);
        router.push(`/month=${month}`);
    };
    useEffect(() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        setCurrentMonth(`${year}-${month}`);
    }, []);
    return (
        <>
            <div className="align-items-end d-flex gap-x-2 selectbox">
                <p className="fw-semibold mb-2 nowrap">Select Month</p>
                <div className="input-group date-selectbox">
                    <input
                        type="month"
                        className="form-control"
                        value={currentMonth}
                        onChange={handleMonthChange}
                    />
                    {/* <div className="input-group-text">
                        <i className="ri-calendar-line"></i>
                    </div> */}
                </div>
            </div>
        </>
    );
};
export default StatusDateFilter;