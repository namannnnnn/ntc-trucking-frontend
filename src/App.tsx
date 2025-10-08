import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>

    {/* <DefaultLayout> */}
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Dashboard | NTC - Trucking" />
              <ECommerce />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | NTC - Trucking" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/user-management"
          element={
            <>
              <PageTitle title="User Management | NTC - Trucking" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | NTC - Trucking" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | NTC - Trucking" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/drivers"
          element={
            <>
              <PageTitle title="Driver Management | NTC - Trucking" />
              <Tables />
            </>
          }
        />
         <Route
          path="/trips"
          element={
            <>
              <PageTitle title="Trip Management | NTC - Trucking" />
              <Trips />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | NTC - Trucking" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | NTC - Trucking" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | NTC - Trucking" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | NTC - Trucking" />
              <Buttons />
            </>
          }
        />
        
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | NTC - Trucking" />
              <SignUp />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Sign In | NTC Trucking" />
              <SignIn />
            </>
          }
        />
    {/* </DefaultLayout> */}
    
    </Routes>

  );
}

export default App;
