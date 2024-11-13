import { useState, useEffect } from 'react';
import { useCreateWorkspace } from '../../api/queries/useWorkspaceQueries';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

const CreateWorkspace = ({ onComplete, onClose }) => {
  // 워크스페이스 상태 관리
  const [isShowNameError, setShowNameError] = useState(false);
  const [isShowDomainError, setShowDomainError] = useState(false);
  const [isShowDescriptionError, setShowDescriptionError] = useState(false);
  const [projectName, setprojectName] = useState('');
  const [domain, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  // 각 오류 메시지 상태 관리
  const [nameErrorMessage, setNameErrorMessage] = useState('프로젝트 이름을 입력해주세요.');
  const [domainErrorMessage, setDomainErrorMessage] = useState('도메인 주소를 입력해주세요.');
  const descriptionErrorMessage = '최대 255글자까지 입력 가능합니다.';

  // React Query
  const workSpaceMutation = useCreateWorkspace({
    onSuccess: (data) => {
      onComplete(data.id); // 생성된 워크스페이스 ID를 부모 컴포넌트로 전달
    },
  });

  // workspace 생성 함수
  const CreateWorkSpaceAPI = () => {
    if (projectName && domain && projectName.length <= 30 && domain.length <= 255 && description.length <= 255) {
      workSpaceMutation.mutate({ mainImage, projectName, description, domain });
      toast('워크스페이스가 생성되었습니다.');
    } else {
      if (!projectName) {
        setShowNameError(true);
      } else if (projectName.length > 30) {
        setNameErrorMessage('최대 30글자까지 입력 가능합니다.');
        setShowNameError(true);
      }

      if (!domain) {
        setShowDomainError(true);
      } else if (domain.length > 255) {
        setDomainErrorMessage('최대 255글자까지 입력 가능합니다.');
        setShowDomainError(true);
      }

      setShowDescriptionError(description.length > 255);
    }
  };

  // 파일이 선택되면 실행될 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 선택된 파일 가져오기
    if (file) {
      setMainImage(file); // 원본 File 객체를 상태에 저장
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 URL 생성 및 저장
    }
  };

  useEffect(() => {
    if (projectName) {
      setShowNameError(false);
    }
    if (domain) {
      setShowDomainError(false);
    }
    if (description.length < 255) {
      setShowDescriptionError(false);
    }
  }, [projectName, domain, description]);

  return (
    // 모달 화면 위치 정의
    <div className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-30 z-50'>
      {/* 모달 크기 정의 */}
      <div className='flex flex-col items-center bg-white w-[800px] h-[800px] border rounded-2xl dark:bg-dark-background'>
        <header className='flex justify-between items-center w-full text-xl mb-4 h-[80px] bg-[#f0f5f8] dark:bg-dark-background border-b rounded-t-2xl'>
          <div className='text-3xl ml-10'>Create Workspace</div>
          <button className='mr-4' onClick={onClose}>
            <IoClose className='text-3xl' />
          </button>
        </header>

        {/* 내부 컴포넌트 크기 정의 */}
        <div className='flex justify-center flex-col w-[400px] h-[640px]'>
          <div className='mb-2'>
            <div className='flex flex-col justify-center items-center mb-2'>
              <img
                src={previewImage || '/src/assets/workspace/basic_image.png'}
                alt='preview'
                className='border rounded-lg h-[150px] w-[200px] mb-2 object-contain'
              />
              <input
                type='file'
                accept='image/*' // 이미지만 허용
                onChange={handleImageChange} // 파일이 선택될 때마다 handleImageChange 실행
                className='border rounded-lg w-[300px] mb-3'
              />
            </div>

            <div className='flex flex-col mb-1'>
              {/* WorkSpace 이름 입력 */}
              <div className='flex'>
                <div className='text-lg'>WorkSpaces name</div>
                <div className='text-sm text-red-500'>*</div>
              </div>
              <input
                type='text'
                className='border w-full h-14 p-5 rounded-lg dark:bg-dark-background'
                placeholder='Project name'
                value={projectName}
                onChange={(e) => setprojectName(e.target.value)}
              />
              <div className={`${isShowNameError ? 'visible' : 'invisible'} text-red-500`}>{nameErrorMessage}</div>
            </div>

            {/* Domain 주소 입력 */}
            <div className='flex flex-col mb-1'>
              <div className='flex'>
                <div className='text-lg'>Domain Address</div>
                <div className='text-sm text-red-500'>*</div>
              </div>
              <input
                type='text'
                className='border w-full h-14 p-5 rounded-lg dark:bg-dark-background'
                placeholder='k11b305.ssafy.p.io'
                value={domain}
                onChange={(e) => setDomainName(e.target.value)}
              />
              <div className={`${isShowDomainError ? 'visible' : 'invisible'} text-red-500`}>{domainErrorMessage}</div>
            </div>

            {/* Description 입력 */}
            <div className='flex flex-col'>
              <div className='text-lg'>Description</div>
              <textarea
                type='text'
                className='border w-full h-28 p-3 rounded-lg sidebar-scrollbar resize-none dark:bg-dark-background'
                placeholder='Introduction to the Project'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className={`${isShowDescriptionError ? 'visible' : 'invisible'} text-red-500`}>
                {descriptionErrorMessage}
              </div>
            </div>
          </div>
          <button
            className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400'
            onClick={CreateWorkSpaceAPI}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
