import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../components/layout/Layout';
import Workspace from '../pages/Workspace';
import WorkspaceSelection from '../pages/Workspace/WorkspaceSelection';
import ApiOverview from '../pages/ApiOverview';
import ApiDocsDetail from '../pages/ApiDocsDetail';
import Page404 from '../pages/404page';
import DashboardOverview from '../pages/Dashboard/DashboardOverview';
import DashboardDaily from '../pages/Dashboard/DashboardDaily';
import DashboardStatus from '../pages/Dashboard/DashboardStatus';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route
        path='/asd'
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route path='/login' element={<Login />} />
      <Route path='/workspaces' element={<WorkspaceSelection />} />
      <Route
        path='/workspace/:workspaceId'
        element={
          <Layout>
            <Workspace />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/apidocs/all'
        element={
          <Layout>
            <ApiOverview />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/apidocs/:apiId'
        element={
          <Layout>
            <ApiDocsDetail />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/dashboard/all'
        element={
          <Layout>
            <DashboardOverview />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/dashboard/daily'
        element={
          <Layout>
            <DashboardDaily />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/dashboard/status'
        element={
          <Layout>
            <DashboardStatus />
          </Layout>
        }
      />
      <Route path='/404page' element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;
