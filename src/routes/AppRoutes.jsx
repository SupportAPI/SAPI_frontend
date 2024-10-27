import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../components/layout/Layout';
import Workspace from '../pages/Workspace';
import WorkspaceSelection from '../pages/Workspace/WorkspaceSelection';
import AllApiDocs from '../pages/AllApiDocs';
import ApiDocsDetail from '../pages/ApiDocsDetail';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<div>Login a tab to get started.</div>} />
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
            <AllApiDocs />
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
    </Routes>
  );
};

export default AppRoutes;
