'use client';
import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Pagination } from 'semantic-ui-react';

const Paginator = ({ totalRecords, data }: any) => {
    const router = useRouter();
    const url = usePathname();
    const searchParams = useSearchParams();

    const hrDepSelected = searchParams.get('departmentId') ?? 1009;
    const state = {
        showEllipsis: true,
        showFirstAndLastNav: true,
        showPreviousAndNextNav: true,
    };

    const totalPages = () => {
        let totalPagesCount = totalRecords / data?.pageSize;
        totalPagesCount =
            totalPagesCount % 1 === 0
                ? totalPagesCount
                : Math.ceil(totalPagesCount);

        if (totalRecords === 0) {
            router.push(
                `${url}/?page=${data.pageNumber > 1 ? data.pageNumber - 1 : 1}&size=${data.pageSize}&status=${data.projectStatus}&search=${data.searchValue}&startDate=${data.startDate}&endDate=${data.endDate}&hiringStatus=${data.hiringStatus}&bilingType=${data.bilingType}`
            );
        }
        return totalPagesCount;
    };

    const handlePaginationChange = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        { activePage }: any
    ) => {
        if (data.employeeStatus) {
            return router.push(
                `${url}/?page=${activePage}&size=${data.pageSize}&empStatus=${data.employeeStatus}&search=${data.searchValue}&startDate=${data.startDate}&endDate=${data.endDate}&departmentId=${hrDepSelected}`
            );
        }
        return router.push(
            `${url}/?page=${activePage}&size=${data.pageSize}&status=${data.projectStatus}&search=${data.searchValue}&startDate=${data.startDate}&endDate=${data.endDate}&hiringStatus=${data.hiringStatus}&bilingType=${data.bilingType}&departmentId=${hrDepSelected}`
        );
    };

    return (
        <Pagination
            activePage={data.pageNumber}
            onPageChange={handlePaginationChange}
            size="mini"
            totalPages={totalPages()}
            // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
            ellipsisItem={state.showEllipsis ? undefined : null}
            firstItem={state.showFirstAndLastNav ? undefined : null}
            lastItem={state.showFirstAndLastNav ? undefined : null}
            prevItem={state.showPreviousAndNextNav ? undefined : null}
            nextItem={state.showPreviousAndNextNav ? undefined : null}
        />
    );
};

export default Paginator;