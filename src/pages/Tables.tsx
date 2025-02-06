import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import { Link, useNavigate } from 'react-router-dom';

const Tables = () => {

  
    const navigate = useNavigate();
          
    if(localStorage.getItem('token') === undefined || !localStorage.getItem('token') || localStorage.getItem('token') === null){
        navigate('auth/signin')
    }
  

  return (
    <>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </>
  );
};

export default Tables;
