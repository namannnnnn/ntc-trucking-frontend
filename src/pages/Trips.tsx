import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import { Link, useNavigate } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../store';
import { fetchTrips } from '../features/fetchTripsSlice';
import { Trip } from '../types/trips';

const Trips = () => {

  useEffect(() => {
    if(localStorage.getItem('token') === undefined || !localStorage.getItem('token') || localStorage.getItem('token') === null){
      navigate('auth/signin')
    }
  }, []);

  const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
  
    const [tripData, setTripData] = useState<Trip[]>([]);

    useEffect(()=>{
      getAllTrips()
    },[])

      const getAllTrips = async() => {
        const result = await dispatch(fetchTrips());
        if (result.meta.requestStatus === 'fulfilled') {
          console.log("fulfilled")
          setTripData(result.payload)
        }
      }


  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Trips" />
          <div className="flex flex-col gap-10">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Origin
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Destination
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {tripData.map((packageItem, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {packageItem.driver.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.origin}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {packageItem.destination}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(packageItem.date)}
                  </p>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>        </div>
      </DefaultLayout>
    </>
  );
};

export default Trips;
