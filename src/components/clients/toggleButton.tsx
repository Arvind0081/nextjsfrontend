'use client'
import React from 'react'
import {useRouter,usePathname} from 'next/navigation';
const ToggleButton =({params}:any)=> {

    const router=useRouter();
    const url=usePathname();

   // const [showListContent, setShowListContent] = useState(true);
    const toggleView = (isList: boolean) => {
      
       // setShowListContent(isList);
        // if(!isList){

            return router.push(`${url}/?showListContent=${isList}&page=${params.currentPage}&size=${params.pageSize}&search=${params.searchValue}`);
        // }
        // return router.push(`${url}`);
      };
  return (
   <>
      <button className={`btn ${params.showListContent==='true' ? 'active' : ''}`} id='GridBtn' onClick={() => toggleView(true)}><i className='bi bi-list-check'></i></button>
   <button className={`btn ${params.showListContent==='false' ? 'active' : ''}`} id='listBtn' onClick={() => toggleView(false)}><i className='bi bi-grid-3x3'></i></button>

   </>
  )
}

export default ToggleButton