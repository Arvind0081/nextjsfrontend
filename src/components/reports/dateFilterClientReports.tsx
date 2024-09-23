'use client';
import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';

const DateFilterClientReports = () => {
    //Initialize hook
    const router = useRouter();
    const url = usePathname();
    const searchParams = useSearchParams();
    // Calculate DefaultValue for Calendar
    let today = new Date();
    let startDate = format(
        new Date(today.setDate(today.getDate())),
        'yyyy-MM-dd'
    );
    let endDate = format(new Date(), 'yyyy-MM-dd');

    //Get Params
    const activeTab = searchParams.get('tab');
    const currentPage: any = searchParams?.get('pageNumber') ?? 1;
    const pageSize: any = searchParams?.get('pageSize') ?? 10;
    const searchQuery = searchParams?.get('search') ?? '';
    const hoursFrom = searchParams?.get('hoursFrom') ?? startDate;
    const hoursTo = searchParams?.get('hoursTo') ?? endDate;

    //Declare State
    const [currentHoursFrom, setCurrentHoursFrom] = useState<any>(hoursFrom);
    const [currentHoursTo, setCurrentHoursTo] = useState<any>(hoursTo);

    const handleHoursFrom = (e: any) => {
        const months = e.target.value;

        setCurrentHoursFrom(e.target.value);
        router.push(
            `${url}?tab=${activeTab}&hoursFrom=${months}&hoursTo=${currentHoursTo}&pageNumber=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
        );
    };
    const handleHoursTo = (e: any) => {
        const hours = e.target.value;
        setCurrentHoursTo(e.target.value);
        router.push(
            `${url}?tab=${activeTab}&hoursFrom=${currentHoursFrom}&hoursTo=${hours}&pageNumber=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
        );
    };

    return (
        <>
            <div className="align-items-end d-flex gap-x-2 selectbox mb-1">
                <p className="fw-semibold mb-2">From:</p>
                <div className="input-group date-selectbox">
                    <input
                        type="date"
                        className="form-control"
                        value={currentHoursFrom ?? startDate}
                        onChange={handleHoursFrom}
                    />
                </div>
            </div>
            <div className="align-items-end d-flex gap-x-2 selectbox mb-1">
                <p className="fw-semibold mb-2">To:</p>
                <div className="input-group date-selectbox">
                    <input
                        type="date"
                        className="form-control"
                        value={currentHoursTo ?? endDate}
                        onChange={handleHoursTo}
                    />
                </div>
            </div>
        </>
    );
};
export default DateFilterClientReports;
