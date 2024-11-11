import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../components/layout/Layout';
import Workspace from '../pages/Workspace';
import WorkspaceSelection from '../pages/Workspace/WorkspaceSelection';
import ApiOverview from '../pages/ApiOverview';
import ApiDocsDetail from '../pages/ApiDocsDetail';
import Page404 from '../pages/404page';
import DashboardOverview from '../pages/Dashboard/DashboardOverview';
import useAuthStore from '../stores/useAuthStore';
import Environment from '../pages/Environment/Environment';
import ApiTest from '../pages/ApiTest/APItest';
import ApiTestDetail from '../pages/ApiTest/ApiTestDetail';

const AppRoutes = () => {
  const userId = useAuthStore((state) => state.userId);

  return (
    <Routes>
      <Route path='/' element={userId ? <Navigate to='/workspaces' /> : <Login />} />
      <Route path='/login' element={userId ? <Navigate to='/workspaces' /> : <Login />} />
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
        path='/workspace/:workspaceId/environment/:environmentId'
        element={
          <Layout>
            <Environment />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/api-test'
        element={
          <Layout>
            <ApiTest />
          </Layout>
        }
      />
      <Route
        path='/workspace/:workspaceId/api-test/:apiId'
        element={
          <Layout>
            <ApiTestDetail />
          </Layout>
        }
      />
      <Route path='/404page' element={<Page404 />} />
      <Route path='*' element={<Navigate to='/404page' />} />
    </Routes>
  );
};

export default AppRoutes;
