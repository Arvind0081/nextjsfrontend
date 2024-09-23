//components/commomnComponents/searchInput

'use client';
import { useRouter,usePathname} from 'next/navigation';

const Search = ({payload}:any) => {

  const router = useRouter();
  const url = usePathname();


  const searchDynamically = async (event: React.ChangeEvent<HTMLInputElement>  ) => {
    
    const query = event.target.value;
    router.push(`${url}?page=${payload?.pagenumber}&size=${payload.pageSize}&empStatus=${payload.isActive}&departmentId=${payload.departmentID}&designation=${payload.designation}&searchValue=${query}`);
  
  };

  return (
    <div>
      <input
        className="form-control"
        type="text"
        value={payload?.searchValue}
        placeholder="Search Here"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          searchDynamically(event)
        }
      /> <i className="bi bi-search"></i>
    </div>
  );
};

export default Search;
