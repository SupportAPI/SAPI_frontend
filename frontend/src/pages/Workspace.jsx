import { useParams } from 'react-router-dom';

const Workspace = () => {
  const { id: workspaceId } = useParams();

  return (
    <div className='p-4'>
      <h2 className='text-2xl mb-4'>Workspace ID: {workspaceId}</h2>
      <p>Welcome to the workspace dashboard for workspace ID {workspaceId}!</p>
    </div>
  );
};

export default Workspace;
