import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../store';
import { fetchDrivers } from '../features/fetchDriversSlice';
import { Driver } from '../types/driver';
import { createDriver } from '../features/createDriverSlice';
import { editDriver } from '../features/editDriverSlice';
import { deleteDriver } from '../features/deleteDriverSlice';
import $ from 'jquery'
import { toast } from 'react-toastify';

const Tables = () => {

  useEffect(() => {
    if(localStorage.getItem('token') === undefined || !localStorage.getItem('token') || localStorage.getItem('token') === null){
      navigate('auth/signin')
    }
  }, []);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
  
    const [driverData, setDriverData] = useState<Driver[]>([]);
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [contactNumber, setContactNumber] = useState<string>('')
    const [truckNumberPlate, setTruckNumberPlate] = useState<string>('')

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [driverId, setDriverId] = useState<string>('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenDel, setIsModalOpenDel] = useState(false);
      
    useEffect(()=>{
      getAllDrivers()
    },[])

    const getAllDrivers = async() => {
      const result = await dispatch(fetchDrivers());
      if (result.meta.requestStatus === 'fulfilled') {
        console.log("fulfilled")
        setDriverData(result.payload)
      } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Trip creation failed!');
        }
      }
    }

    if (
      localStorage.getItem('token') === undefined ||
      !localStorage.getItem('token') ||
      localStorage.getItem('token') === null
    ) {
      navigate('auth/signin');
    }

    const openPopup = () => {
      $("#driver-details-modal").removeClass("hidden");
      $("#driver-details-modal").addClass("show ");
      setIsModalOpen(true)
    }
  
    const closePopup = () => {
      $("#driver-details-modal").removeClass("show");
      $("#driver-details-modal").addClass("hidden");
      setIsEdit(false)
      setName('')
      setEmail('')
      setContactNumber('')
      setTruckNumberPlate('')
      setIsModalOpen(false)
    }

    const createNewDriver = async() => {
      if(isEdit){
        const result = await dispatch(editDriver({ name, email,contactNumber ,truckNumberPlate, driverId }));
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Driver details were edited successfully!');
          getAllDrivers()
          setIsEdit(false)
          setName('')
          setEmail('')
          setContactNumber('')
          setTruckNumberPlate('')
          setDriverId('')
          // $("#driver-details-modal").removeClass("show");
          // $("#driver-details-modal").addClass("hidden");
          closePopup()
        } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Driver updation failed!');
        }
        
      }
      }else{
        const result = await dispatch(createDriver({ name, email, contactNumber, truckNumberPlate }));
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Driver was created successfully!');
          getAllDrivers()
          setIsEdit(false)
          setName('')
          setEmail('')
          setContactNumber('')
          setTruckNumberPlate('')
          // $("#driver-details-modal").removeClass("show");
          // $("#driver-details-modal").addClass("hidden");
          closePopup()
        } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Driver creation failed!');
        }
      }
      }
    }

    const openEditDriverPopup = (driver:any) => {
      setName(driver.name)
      setEmail(driver.email)
      setContactNumber(driver.contactNumber)
      setTruckNumberPlate(driver.truckNumberPlate)
      $("#driver-details-modal").removeClass("hidden");
      $("#driver-details-modal").addClass("show");
      setIsEdit(true)
      setDriverId(driver["_id"])
      setIsModalOpen(true)
    }

    const openDeleteDriverPopup = (driverId: any) => {
      setDriverId(driverId)
      $("#delete-driver-modal").removeClass("hidden");
      $("#delete-driver-modal").addClass("show");
      setIsModalOpenDel(true)
    }
  
    const closeDeletePopup = () => {
      $("#delete-driver-modal").removeClass("show");
      $("#delete-driver-modal").addClass("hidden");
      setDriverId('')
      setIsModalOpenDel(false)
    }
  
    const deleteParticularDriver = async() => {
      const result = await dispatch(deleteDriver({driverId}));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Driver deleted successfully!');
        getAllDrivers()
        // setDriverId('')
        // $("#delete-driver-modal").removeClass("show");
        // $("#delete-driver-modal").addClass("hidden");
        closeDeletePopup()
      } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Driver deletion failed!');
        }
        
      }
    }


  return (
    <>
      <DefaultLayout>
        {/* <Breadcrumb pageName="Drivers" /> */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
              Drivers
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row align-items-center sm:justify-end">
            <button data-modal-target="crud-modal" data-modal-toggle="crud-modal" data-modal-show="crud-modal" data-dialog-backdrop="crud-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={()=>openPopup()}>
                Create Driver
            </button>
            </div>
          </div>
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
                        Email
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Contact Number
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Truck Number Plate
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverData.map((packageItem, key) => (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                          <h5 className="font-medium text-black dark:text-white">
                            {packageItem.name}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {packageItem.email}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {packageItem.contactNumber}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {packageItem.truckNumberPlate}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="flex items-center space-x-3.5">
                            <button className="hover:text-primary" type='button' onClick={()=>openEditDriverPopup(packageItem)}>
                              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.18571 2.5813H2.98571C2.59168 2.5813 2.21378 2.73838 1.93516 3.01799C1.65653 3.29761 1.5 3.67684 1.5 4.07227V14.5091C1.5 14.9045 1.65653 15.2837 1.93516 15.5634C2.21378 15.843 2.59168 16.0001 2.98571 16.0001H13.3857C13.7798 16.0001 14.1576 15.843 14.4363 15.5634C14.7149 15.2837 14.8714 14.9045 14.8714 14.5091V9.29068" stroke="#7B7D9F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M13.7572 1.46319C14.0527 1.16661 14.4535 1 14.8714 1C15.2894 1 15.6902 1.16661 15.9857 1.46319C16.2813 1.75976 16.4473 2.162 16.4473 2.58142C16.4473 3.00083 16.2813 3.40307 15.9857 3.69964L8.92858 10.7818L5.95715 11.5273L6.70001 8.54531L13.7572 1.46319Z" stroke="#7B7D9F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                            <button className="hover:text-primary" type='button' onClick={() => openDeleteDriverPopup(packageItem["_id"])} data-modal-target="delete-driver-modal" data-modal-toggle="delete-driver-modal" data-modal-show="delete-driver-modal">
                              <svg width="16" height="18" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.48137 1.36229L8.69889 1.57051H9H11.1429C11.1805 1.57051 11.2103 1.58488 11.2296 1.60332C11.2484 1.62132 11.25 1.63503 11.25 1.64103C11.25 1.64702 11.2484 1.66073 11.2296 1.67873C11.2103 1.69717 11.1805 1.71154 11.1429 1.71154H0.857143C0.819462 1.71154 0.789673 1.69717 0.770413 1.67873C0.751611 1.66073 0.75 1.64702 0.75 1.64103C0.75 1.63503 0.751611 1.62132 0.770413 1.60332C0.789673 1.58488 0.819462 1.57051 0.857143 1.57051H3H3.30111L3.51863 1.36229L4.1272 0.779729C4.1303 0.776755 4.14138 0.767931 4.16072 0.760221C4.1798 0.752608 4.19716 0.75 4.20857 0.75H7.79143C7.80284 0.75 7.8202 0.752608 7.83928 0.760221C7.85862 0.767932 7.8697 0.776756 7.8728 0.779729L8.48137 1.36229ZM2.57143 14.0192C2.01158 14.0192 1.60714 13.586 1.60714 13.1282V4.92308C1.60714 4.46526 2.01158 4.03205 2.57143 4.03205H9.42857C9.98842 4.03205 10.3929 4.46526 10.3929 4.92308V13.1282C10.3929 13.586 9.98842 14.0192 9.42857 14.0192H2.57143Z" stroke="#7B7D9F" stroke-width="1.5"></path><path d="M11.1429 0.820513H9L8.39143 0.237949C8.23714 0.0902564 8.01429 0 7.79143 0H4.20857C3.98571 0 3.76286 0.0902564 3.60857 0.237949L3 0.820513H0.857143C0.385714 0.820513 0 1.18974 0 1.64103C0 2.09231 0.385714 2.46154 0.857143 2.46154H11.1429C11.6143 2.46154 12 2.09231 12 1.64103C12 1.18974 11.6143 0.820513 11.1429 0.820513Z" fill="#7B7D9F"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>        
          </div>
          {isModalOpen && (
          <>
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"> </div>
          <div id="driver-details-modal" tabIndex="-1" aria-hidden="true" 
            className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full xl:w-1/2 md:inset-0 h-[calc(100%-1rem)] max-h-full"
            style={{left: "30%", top:"15%"}}
            >
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {isEdit == true ? "Edit Driver" : "Create Driver"}
            </h3>
            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal" onClick={()=>closePopup()}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
            </button>
          </div>
          <form>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter your Name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e)=>setName(e.target.value)}
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter the user's email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    placeholder="Enter your Contact Number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e)=>setContactNumber(e.target.value)}
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Truck Plate Number
                  </label>
                  <input
                    type="text"
                    value={truckNumberPlate}
                    placeholder="Enter Truck's Plate Number"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    onChange={(e)=>setTruckNumberPlate(e.target.value)}
                  />
                </div>
              </div>

              <button type="button" onClick={()=>createNewDriver()} className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" >
              Save
            </button>
            </div>
          </form>
        </div>
        </div> </>)}

        {isModalOpenDel && (
          <>
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"> </div>
        <div id="delete-driver-modal" tabIndex="-1" aria-hidden="true" 
            className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full xl:w-1/2 md:inset-0 h-[calc(100%-1rem)] max-h-full"
            style={{left: "30%", top:"5%", zIndex: "9999"}}
            >
            <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
              <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                <h3 id="delte-user-modal-label" className="font-bold text-gray-800 dark:text-white">
                  Delete Driver
                </h3>
                <button type="button" onClick={()=>closeDeletePopup()} className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#delte-user-modal">
                  <span className="sr-only">Close</span>
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <p className="mt-1 text-gray-800 dark:text-neutral-400">
                  Are you sure you want to delete this driver?
                </p>
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                <button type="button" onClick={()=>closeDeletePopup()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#delte-user-modal">
                  Close
                </button>
                <button type="button" onClick={()=>deleteParticularDriver()} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  Delete
                </button>
              </div>
            </div>
        </div> 
        </>)}
      </DefaultLayout>
    </>
  );
};

export default Tables;
