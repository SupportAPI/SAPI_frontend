import { useState, useEffect } from 'react';
import { useModifiedWorkspace } from '../../api/queries/useWorkspaceQueries';
import { useFetchWorkspacesDetail } from '../../api/queries/useWorkspaceQueries';
import { useParams } from 'react-router-dom';

const SettingWorkspace = () => {
  const { workspaceId: currentWorkspaceId } = useParams();
  const { data: workspacedetail, refetch } = useFetchWorkspacesDetail(currentWorkspaceId);

  const [projectName, setProjectName] = useState('');
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(''); // 기존 URL 저장
  const [previewImage, setPreviewImage] = useState(''); // 미리보기 이미지

  const { mutate } = useModifiedWorkspace();

  useEffect(() => {
    if (workspacedetail) {
      setProjectName(workspacedetail.projectName);
      setDomain(workspacedetail.domain);
      setDescription(workspacedetail.description);
      setIsCompleted(workspacedetail.isCompleted);
      setOriginalImage(workspacedetail.mainImage); // 기존 URL 저장
      setPreviewImage(workspacedetail.mainImage); // 초기 이미지 설정
    }
  }, [workspacedetail]);

  const handleSave = () => {
    mutate(
      {
        workspaceId: currentWorkspaceId,
        mainImage: mainImage || '', // 파일이 없으면 null 전송
        projectName,
        domain,
        description,
        isCompleted,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewImage(URL.createObjectURL(file)); // 미리보기용 URL 생성
    }
  };

  return (
    <div className='m-10 dark:text-dark-text'>
      <h2 className='text-2xl mb-5'>Workspace</h2>
      <div className='border mb-5'></div>
      <div className='flex flex-col items-center'>
        <div>
          <label htmlFor='mainImageUpload'>
            <img
              src={previewImage || originalImage}
              alt='이미지'
              className='rounded-3xl w-56 h-40 bg-gray-50 object-contain cursor-pointer'
            />
          </label>
          <input
            type='file'
            id='mainImageUpload'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </div>

        <div className='flex flex-col w-[80%] mt-10'>
          <div className='flex items-center mb-5'>
            <label className='text-xl w-[150px]'>Project :</label>
            <input
              type='text'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className='border-b w-full dark:bg-dark-background'
            />
          </div>

          <div className='flex items-center mb-5'>
            <label className='text-xl w-[150px]'>Domain :</label>
            <input
              type='text'
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className='border-b w-full dark:bg-dark-background '
            />
          </div>

          <div className='flex flex-col mb-5'>
            <label className='text-xl'>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='border p-2 w-full dark:bg-dark-background sidebar-scrollbar rounded-lg'
            ></textarea>
          </div>
          <button onClick={handleSave} className='bg-blue-500 text-white py-2 px-5 rounded-md'>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingWorkspace;
