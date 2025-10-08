import { Link, useNavigate } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../store';
import { fetchTrips } from '../features/fetchTripsSlice';
import { Trip } from '../types/trips';
import { createTrip } from '../features/createTripSlice';
import { editTripAsDriver, editTripFinancialsAsAdmin } from '../features/editTripSlice';
import { deleteTrip } from '../features/deleteTripSlice';
import $ from 'jquery';
import { toast } from 'react-toastify';

const Trips = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [trip, setTrip] = useState({
    origin: '',
    destination: '',
    payPerMile: 0,
    mileage: 0,
    additionalIncome: 0,
    grossIncome: 0,
    fuelCost: 0,
    additionalCosts: [],
    startTime: true,
    endTime: true,
    totalExpenses: 0,
    balance: 0,
    otherPay: 0,
    startTimeStamp: '',
    endTimeStamp: '',
    costPerMile: 0
  });
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const userRole = localStorage.getItem("role");
  const [startTimeDisabled, setStartTimeDisabled] = useState(false)
  const [tripId, setTripId] = useState('')

  useEffect(() => {
    if (
      localStorage.getItem('token') === undefined ||
      !localStorage.getItem('token') ||
      localStorage.getItem('token') === null
    ) {
      navigate('auth/signin');
    }

  }, []);

  useEffect(() => {
    // Total Expense = fuelCost + sum of additionalCosts
    const totalExpenses =
      Number(trip.fuelCost || 0) +
      (trip.additionalCosts?.reduce(
        (sum, cost) => sum + Number(cost.amount || 0),
        0
      ) || 0);
  
    // Driver's Pay = payPerMile * mileage
    const driversPay = Number(trip.payPerMile || 0) * Number(trip.mileage || 0);
  
    // Gross Income
    const grossIncome = Number(trip.grossIncome || 0);
  
    // Balance = grossIncome - (driversPay + otherPay + totalExpenses)
    const balance = grossIncome - (driversPay + Number(trip.otherPay || 0) + totalExpenses);

    const costPerMile =Math.round((Number(trip.fuelCost || 0)/Number(trip.mileage || 0) + Number.EPSILON) * 100) / 100 ;
  
    // Update state
    setTrip(prev => ({
      ...prev,
      totalExpenses,
      balance,
      costPerMile
    }));
  }, [
    trip.fuelCost,
    trip.additionalCosts,
    trip.payPerMile,
    trip.mileage,
    trip.additionalIncome,
    trip.grossIncome,
  ]);
  const InputField = ({type, label, value, onChange, disabled = false }) => (
    <div className="w-full xl:w-1/2">
      <label className="mb-2 block text-black dark:text-white">
        {label} <span className="text-meta-1">*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="no-spinner w-full rounded border border-stroke bg-transparent py-3 px-5 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white focus:border-primary outline-none disabled:cursor-default disabled:bg-whiter "
      />
    </div>
  );

  const openPopup = () => {
    console.log('Inside open popup');
    $('#crud-modal2').removeClass('hidden');
    $('#crud-modal2').addClass('show');
    setIsModalOpen(true)
  };

  const closePopup = () => {
    $('#crud-modal2').removeClass('show');
    $('#crud-modal2').addClass('hidden');

    $('#crud-modal-edit').removeClass('show');
    $('#crud-modal-edit').addClass('hidden');
    setIsEdit(false);
    setIsModalOpen(false)
    setStartTimeDisabled(false)
    setIsModalOpenEdit(false)
    setTrip({
      origin: '',
      destination: '',
      payPerMile: 0,
      mileage: 0,
      additionalIncome: 0,
      grossIncome: 0,
      fuelCost: 0,
      additionalCosts: [],
      startTime: true,
      endTime: true,
      totalExpenses: 0,
      balance: 0,
      otherPay: 0,
      startTimeStamp: '',
      endTimeStamp: '',
    })
  };

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const createNewTrip = async () => {
    console.log(trip, "trip final")
    if (isEdit) {
      let result;
      if (userRole === 'Driver') {
        result = await dispatch(editTripAsDriver({
          tripId: trip._id,
          startTime: trip.startTime,
          endTime: trip.endTime,
          fuelCost: trip.fuelCost,
          additionalCosts: trip.additionalCosts
        }));
      } else if (userRole === 'Admin') {
        result = await dispatch(editTripFinancialsAsAdmin({
          tripId: trip._id,
          payPerMile: trip.payPerMile,
          mileage: trip.mileage,
          grossIncome: trip.grossIncome,
          additionalIncome: trip.additionalIncome,
          otherPay: trip.otherPay
        }));
      }
      // const result = await dispatch(createTrip({ origin, destination }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Trip edited successfully!');
        getAllTrips();
        setIsEdit(false);
        setOrigin('');
        setDestination('');
        // $('#crud-modal-edit').removeClass('show');
        // $('#crud-modal-edit').addClass('hidden');
        closePopup()
      } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Trip creation failed!');
        }
      }
    }else {
      const result = await dispatch(createTrip({ origin, destination }));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Trip created successfully!');
        getAllTrips();
        setIsEdit(false);
        setOrigin('');
        setDestination('');
        // $('#crud-modal2').removeClass('show');
        // $('#crud-modal2').addClass('hidden');
        closePopup()
      } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Trip creation failed!');
        }
        
      }
    }
  };

  const openEditTripPopup = (trip: any) => {
    $('#crud-modal-edit').removeClass('hidden');
    $('#crud-modal-edit').addClass('show');
    setIsEdit(true);
    setIsModalOpenEdit(true)
    const updatedTrip = { ...trip };

    if (updatedTrip.startTime && updatedTrip.startTime !== "") {
      setStartTimeDisabled(true);
      updatedTrip.startTimeStamp = updatedTrip.startTime;
      updatedTrip.startTime = false;
    }

    setTrip(updatedTrip);
  };

  const openDeleteUserPopup = (tripId: any) => {
    $('#delete-user-modal').removeClass('hidden');
    $('#delete-user-modal').addClass('show');
    setIsModalOpenDel(true)
    setTripId(tripId)
  };

  const closeDeletePopup = () => {
    $('#delete-user-modal').removeClass('show');
    $('#delete-user-modal').addClass('hidden');
    setIsModalOpenDel(false)
    setTripId('')
  };

  const handleDelete =async(tripId: string) => {
    const result = await dispatch(deleteTrip(tripId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Trip was deleted successfully!');
      getAllTrips()
      closeDeletePopup()
    } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Trip deletion failed!');
        }
        
      }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [tripData, setTripData] = useState<Trip[]>([]);

  useEffect(() => {
    getAllTrips();
  }, []);

  const getAllTrips = async () => {
    const result = await dispatch(fetchTrips());
    console.log(result, "trips")
    if (result.meta.requestStatus === 'fulfilled') {
      console.log('fulfilled');
      setTripData(result.payload);
    } else {
        if(result.payload.status == 403){
          toast.error("You're not authorized to perform this action");
        } else {
          toast.error('Trip creation failed!');
        }
      }
  };

  const handleStartTime = () => {
    setTrip((prev) => ({
      ...prev,
      startTimeStamp: new Date().toISOString(),
      startTime: true
    }));
  };
  
  const handleEndTime = () => {
    setTrip((prev) => ({
      ...prev,
      endTimeStamp: new Date().toISOString(),
      endTime: true
    }));
  };

  const addAdditionalCost = () => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      additionalCosts: [
        ...prevTrip.additionalCosts,
        {
          category: '',
          amount: '',
        },
      ],
    }));
  };

  const updateAdditionalCost = (index, field, value) => {
    setTrip((prevTrip) => {
      const updatedCosts = [...prevTrip.additionalCosts];
      updatedCosts[index] = {
        ...updatedCosts[index],
        [field]: value,
      };
      return {
        ...prevTrip,
        additionalCosts: updatedCosts,
      };
    });
  };

  const removeAdditionalCost = (indexToRemove) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      additionalCosts: prevTrip.additionalCosts.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <>
      <DefaultLayout>
        {/* <Breadcrumb pageName="Trips" /> */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Trip Management
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row align-items-center sm:justify-end">
            <button
              data-modal-target="crud-modal2"
              data-modal-toggle="crud-modal2"
              data-modal-show="crud-modal2"
              data-dialog-backdrop="crud-modal2"
              className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              onClick={() => openPopup()}
            >
              Create Trip
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
                      Driver Name
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Origin
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Destination
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Start Time
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      End Time
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
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
                          {packageItem.startTime ? new Date(packageItem.startTime).toLocaleString() : "-"}
                          
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {packageItem.endTime ? new Date(packageItem.endTime).toLocaleString() : "-"}
                          
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            type="button"
                            onClick={() => openEditTripPopup(packageItem)}
                          >
                            <svg
                              width="18"
                              height="17"
                              viewBox="0 0 18 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.18571 2.5813H2.98571C2.59168 2.5813 2.21378 2.73838 1.93516 3.01799C1.65653 3.29761 1.5 3.67684 1.5 4.07227V14.5091C1.5 14.9045 1.65653 15.2837 1.93516 15.5634C2.21378 15.843 2.59168 16.0001 2.98571 16.0001H13.3857C13.7798 16.0001 14.1576 15.843 14.4363 15.5634C14.7149 15.2837 14.8714 14.9045 14.8714 14.5091V9.29068"
                                stroke="#7B7D9F"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                              <path
                                d="M13.7572 1.46319C14.0527 1.16661 14.4535 1 14.8714 1C15.2894 1 15.6902 1.16661 15.9857 1.46319C16.2813 1.75976 16.4473 2.162 16.4473 2.58142C16.4473 3.00083 16.2813 3.40307 15.9857 3.69964L8.92858 10.7818L5.95715 11.5273L6.70001 8.54531L13.7572 1.46319Z"
                                stroke="#7B7D9F"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </svg>
                          </button>
                          <button
                            className="hover:text-primary"
                            type="button"
                            onClick={() =>
                              openDeleteUserPopup(packageItem['_id'])
                              // handleDelete(packageItem._id)
                            }
                            data-modal-target="delete-user-modal"
                            data-modal-toggle="delete-user-modal"
                            data-modal-show="delete-user-modal"
                          >
                            {/* <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg> */}
                            <svg
                              width="16"
                              height="18"
                              viewBox="0 0 14 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.48137 1.36229L8.69889 1.57051H9H11.1429C11.1805 1.57051 11.2103 1.58488 11.2296 1.60332C11.2484 1.62132 11.25 1.63503 11.25 1.64103C11.25 1.64702 11.2484 1.66073 11.2296 1.67873C11.2103 1.69717 11.1805 1.71154 11.1429 1.71154H0.857143C0.819462 1.71154 0.789673 1.69717 0.770413 1.67873C0.751611 1.66073 0.75 1.64702 0.75 1.64103C0.75 1.63503 0.751611 1.62132 0.770413 1.60332C0.789673 1.58488 0.819462 1.57051 0.857143 1.57051H3H3.30111L3.51863 1.36229L4.1272 0.779729C4.1303 0.776755 4.14138 0.767931 4.16072 0.760221C4.1798 0.752608 4.19716 0.75 4.20857 0.75H7.79143C7.80284 0.75 7.8202 0.752608 7.83928 0.760221C7.85862 0.767932 7.8697 0.776756 7.8728 0.779729L8.48137 1.36229ZM2.57143 14.0192C2.01158 14.0192 1.60714 13.586 1.60714 13.1282V4.92308C1.60714 4.46526 2.01158 4.03205 2.57143 4.03205H9.42857C9.98842 4.03205 10.3929 4.46526 10.3929 4.92308V13.1282C10.3929 13.586 9.98842 14.0192 9.42857 14.0192H2.57143Z"
                                stroke="#7B7D9F"
                                stroke-width="1.5"
                              ></path>
                              <path
                                d="M11.1429 0.820513H9L8.39143 0.237949C8.23714 0.0902564 8.01429 0 7.79143 0H4.20857C3.98571 0 3.76286 0.0902564 3.60857 0.237949L3 0.820513H0.857143C0.385714 0.820513 0 1.18974 0 1.64103C0 2.09231 0.385714 2.46154 0.857143 2.46154H11.1429C11.6143 2.46154 12 2.09231 12 1.64103C12 1.18974 11.6143 0.820513 11.1429 0.820513Z"
                                fill="#7B7D9F"
                              ></path>
                            </svg>
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
          <div
            id="crud-modal2"
            tabIndex="-1"
            aria-hidden="true"
            className="overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full xl:w-1/2 md:inset-0 h-[calc(100%-1rem)] max-h-full"
            style={{ left: '30%', top: '15%' }}
          >
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="flex border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  {isEdit == true ? 'Edit Trip' : 'Create Trip'}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal2"
                  onClick={() => closePopup()}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form>
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Origin <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={origin}
                        placeholder="Enter the origin of the trip"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Destination <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={destination}
                        placeholder="Enter the destination of the trip"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        onChange={(e) => setDestination(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => createNewTrip()}
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
          </>)}

        {isModalOpenEdit && (
        <>
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"> </div>
          <div
            id="crud-modal-edit"
            tabIndex={-1}
            aria-hidden="true"
            className="overflow-x-hidden fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4 pt-20"
            style={{ left: '18%'}}
          >
            <div className="w-full max-w-4xl rounded-md border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stroke py-4 px-6 dark:border-strokedark">
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {isEdit == true ? 'Edit Trip' : 'Create Trip'}
                </h3>
                <button
                  onClick={closePopup}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Trip Info Form */}
              <form className="p-6 space-y-6">
                <div className="flex flex-col gap-6 xl:flex-row">
                  <InputField
                    type={"text"}
                    label="Origin"
                    value={trip.origin}
                    onChange={(e) => setTrip({ ...trip, origin: e.target.value })}
                    disabled={userRole == "Driver" ? false : true}
                  />
                  <InputField
                    type={"text"}
                    label="Destination"
                    value={trip.destination}
                    onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
                    disabled={userRole == "Driver" ? false : true}
                  />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <button
                    type="button"
                    onClick={handleStartTime}
                    className={`w-full rounded-md border border-meta-3 py-3 px-6 text-center font-medium text-meta-3 hover:bg-opacity-90 ${
                      userRole !== 'Driver' || startTimeDisabled == true
                        ? 'cursor-not-allowed opacity-50 bg-gray-300 text-gray-700'
                        : 'border border-meta-3 text-meta-3 hover:bg-opacity-90'
                    }`}
                    disabled={userRole == "Driver" && startTimeDisabled == false ? false : true}
                  >
                    Set Start Time
                  </button>
                  {trip.startTimeStamp && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Start: {new Date(trip.startTimeStamp).toLocaleString()}
                    </p>
                  )}
            </div>

            <div className="w-full xl:w-1/2">
              <button
                type="button"
                onClick={handleEndTime}
                className={`w-full rounded-md border border-red py-3 px-6 text-center font-medium text-red hover:bg-opacity-90 ${
                  userRole !== 'Driver'
                    ? 'cursor-not-allowed opacity-50 bg-gray-300 text-gray-700'
                    : 'border border-red text-red hover:bg-opacity-90'
                }`}
                disabled={userRole == "Driver" ? false : true}
              >
                Set End Time
              </button>
              {trip.endTimeStamp && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  End: {new Date(trip.endTimeStamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
              </form>

              {/* Financial Details */}
              <div className="px-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Financial Details
                </h3>
              </div>
              <form className="px-6 pb-6 space-y-6">
                <div className="flex flex-col gap-6 xl:flex-row">
                  <InputField
                    type="number"
                    label="Pay per mile"
                    value={trip.payPerMile}
                    onChange={(e) => setTrip({ ...trip, payPerMile: e.target.value })}
                    disabled={userRole == "Admin" ? false : true}
                  />
                  <InputField
                    type="number"
                    label="Mileage"
                    value={trip.mileage}
                    onChange={(e) => setTrip({ ...trip, mileage: e.target.value })}
                    disabled={userRole == "Admin" ? false : true}
                  />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                  <InputField
                    type="number"
                    label="Driver's Pay"
                    value={
                      parseFloat(trip.payPerMile || 0) * parseFloat(trip.mileage || 0)
                    }
                    onChange={(e)=>console.log("onchange driver's pay")}
                    disabled
                  />
                  <InputField
                    type="number"
                    label="Other Pay"
                    value={trip.otherPay}
                    onChange={(e) =>
                      setTrip({ ...trip, otherPay: e.target.value })
                    }
                    disabled={userRole == "Admin" ? false : true}
                  />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <InputField
                  type="number"
                  label="Gross Income"
                  value={trip.grossIncome}
                  onChange={(e) => setTrip({ ...trip, grossIncome: e.target.value })}
                  disabled={userRole == "Admin" ? false : true}
                />

                <InputField
                  type="number"
                  label="Additional Income"
                  value={trip.additionalIncome}
                  onChange={(e) =>
                    setTrip({ ...trip, additionalIncome: e.target.value })
                  }
                  disabled={userRole == "Admin" ? false : true}
                />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <InputField
                  type="number"
                  label="Total Expense"
                  value={trip.totalExpenses}
                  onChange={(e)=> {console.log("change")}}
                  disabled={true}
                />

                <InputField
                  type="number"
                  label="Balance"
                  value={trip.balance}
                  onChange={(e)=> {console.log("change balance")}}
                  disabled
                />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                <InputField
                  type="number"
                  label="Cost per mile"
                  value={trip.costPerMile}
                  onChange={(e)=> {console.log("change")}}
                  disabled={true}
                />
                </div>
              </form>

              {/* Driver Costs */}
              <div className="px-6">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  Driver Costs
                </h3>
              </div>
              <div className="px-6 pb-6 space-y-6">
                <InputField
                  type="number"
                  label="Fuel Cost"
                  value={trip.fuelCost}
                  onChange={(e) => setTrip({ ...trip, fuelCost: e.target.value })}
                  disabled={userRole == "Driver" ? false : true}
                />
              <div className="flex items-center justify-between mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                Additional Costs<span className="text-meta-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={addAdditionalCost}
                  className={`rounded bg-primary px-4 py-1.5 text-sm text-white hover:bg-opacity-90 ${
                    userRole !== 'Driver'
                      ? 'cursor-not-allowed opacity-50 bg-gray-300 text-gray-700'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  disabled={userRole == "Driver" ? false : true}
                >
                  + Add
                </button>
              </div>
                {/* Dynamic Additional Costs */}
                {trip.additionalCosts?.map((elem, idx) => (
                  <div
                    key={elem._id || idx}
                    className="relative group mb-4.5 flex flex-col gap-6 xl:flex-row border-b border-dashed pb-4"
                  >
                    <div className="w-full xl:w-1/2">
                      <label className="block mb-2 text-black dark:text-white">
                        Category
                      </label>
                      <select
                        name={`category${idx}`}
                        value={elem.category}
                        onChange={(e) =>
                          updateAdditionalCost(idx, 'category', e.target.value)
                        }
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:cursor-default disabled:bg-whiter ${
                          isOptionSelected ? 'text-black dark:text-white' : ''
                        }`}
                        disabled={userRole == "Driver" ? false : true}
                      >
                        <option value="" >
                          Select category
                        </option>
                        <option value="Toll">Toll</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Food">Food</option>
                        <option value="Parking">Parking</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                      </select>
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="block mb-2 text-black dark:text-white">Cost</label>
                      <input
                        type="number"
                        name={`cost${idx}`}
                        value={elem.amount}
                        onChange={(e) =>
                          updateAdditionalCost(idx, 'amount', e.target.value)
                        }
                        disabled={userRole == "Driver" ? false : true}
                        className="w-full rounded border border-stroke py-2 px-4 bg-transparent dark:bg-form-input text-black outline-none focus:border-primary dark:border-form-strokedark dark:text-white disabled:cursor-default disabled:bg-whiter"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditionalCost(idx)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700 hidden group-hover:block opacity-0 group-hover:opacity-100 sm:opacity-100 transition"
                      title="Remove"
                      disabled={userRole == "Driver" ? false : true}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={createNewTrip}
                  className="w-full rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
        )}
        {isModalOpenDel && (
        <>
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"> </div>
        <div
          id="delete-user-modal"
          tabIndex="-1"
          aria-hidden="true"
          className=" overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full xl:w-1/2 md:inset-0 h-[calc(100%-1rem)] max-h-full"
          style={{ left: '30%', top: '5%', zIndex: '9999' }}
        >
          <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3
                id="delte-user-modal-label"
                className="font-bold text-gray-800 dark:text-white"
              >
                Delete User
              </h3>
              <button
                type="button"
                onClick={() => closeDeletePopup()}
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#delte-user-modal"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="mt-1 text-gray-800 dark:text-neutral-400">
                Are you sure you want to delete this trip?
              </p>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
              <button
                type="button"
                onClick={() => closeDeletePopup()}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                data-hs-overlay="#delte-user-modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={()=>handleDelete(tripId)}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
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

export default Trips;
