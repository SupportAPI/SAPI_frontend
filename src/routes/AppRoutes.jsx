import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { getToken } from '../utils/cookies';
import { useEffect } from 'react';
import SignUp from '../pages/SignUp';

const ProtectedRoute = ({ userId, children }) => {
  return userId ? children : <Navigate to='/login' />;
};

const AppRoutes = () => {
  const { userId, logout } = useAuthStore();
  const location = useLocation(); // 현재 경로 감지

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      console.log('로그아웃: 토큰 없음');
      logout(); // 로그아웃 처리
    }
  }, [location.pathname, logout]); // 경로가 변경될 때마다 실행

  return (
    <Routes>
      <Route path='/' element={userId ? <Navigate to='/workspaces' /> : <Navigate to='/login' />} />
      <Route path='/login' element={userId ? <Navigate to='/workspaces' /> : <Login />} />
      <Route
        path='/workspaces'
        element={
          <ProtectedRoute userId={userId}>
            <WorkspaceSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path='/workspace/:workspaceId'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <Workspace />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path='/signup' element={userId ? <Navigate to='/workspace' /> : <SignUp />} />
      <Route
        path='/workspace/:workspaceId/apidocs/all'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <ApiOverview />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/workspace/:workspaceId/apidocs/:apiId'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <ApiDocsDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/workspace/:workspaceId/dashboard/all'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <DashboardOverview />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/workspace/:workspaceId/environment/:environmentId'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <Environment />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/workspace/:workspaceId/api-test'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <ApiTest />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/workspace/:workspaceId/api-test/:apiId'
        element={
          <ProtectedRoute userId={userId}>
            <Layout>
              <ApiTestDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path='/404page' element={<Page404 />} />
      <Route path='*' element={<Navigate to='/404page' />} />
    </Routes>
  );
};

export default AppRoutes;
