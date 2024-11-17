import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useCreateWorkspace } from '../../api/queries/useWorkspaceQueries';
import TextInput from '../../components/common/TextInput';
import { FiUpload } from 'react-icons/fi';

const DEFAULT_IMAGE = '/src/assets/workspace/basic_image.png';

const CreateWorkspace = ({ onComplete, onClose }) => {
  // 상태 관리
  const [projectName, setProjectName] = useState('');
  const [domain, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);

  // 에러 상태 관리
  const [projectNameError, setProjectNameError] = useState('');
  const [domainError, setDomainError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  // React Query
  const workSpaceMutation = useCreateWorkspace({
    onSuccess: (data) => {
      onComplete(data.id); // 생성된 워크스페이스 ID를 부모 컴포넌트로 전달
      toast.success('워크스페이스가 생성되었습니다.');
    },
  });

  // 워크스페이스 생성 API 호출
  const createWorkSpaceAPI = () => {
    if (validateInputs()) {
      workSpaceMutation.mutate({ mainImage, projectName, description, domain });
    }
  };

  // 유효성 검사
  const validateInputs = () => {
    let isValid = true;

    if (!projectName) {
      setProjectNameError('워크스페이스 이름을 입력해주세요.');
      isValid = false;
    } else if (projectName.length > 30) {
      setProjectNameError('워크스페이스 이름은 최대 30글자까지 입력 가능합니다.');
      isValid = false;
    } else {
      setProjectNameError('');
    }

    if (!domain) {
      setDomainError('서버 도메인을 입력해주세요.');
      isValid = false;
    } else if (domain.length > 255) {
      setDomainError('도메인 주소는 최대 255글자까지 입력 가능합니다.');
      isValid = false;
    } else {
      setDomainError('');
    }

    if (description.length > 255) {
      setDescriptionError('설명은 최대 255글자까지 입력 가능합니다.');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    return isValid;
  };

  // 파일 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50 overflow-auto'>
      <div
        className='flex flex-col bg-white w-full max-w-2xl h-auto max-h-[90vh] border rounded-2xl dark:bg-dark-background'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari */
            }
          `}
        </style>

        {/* 헤더 */}
        <header className='flex justify-between items-center w-full text-gray-700 px-6 py-3 z-10 sticky top-0'>
          <h2 className='text-xl'>Create Workspace</h2>
          <button className='text-gray-500 hover:text-gray-700' onClick={onClose}>
            <IoClose className='text-2xl' />
          </button>
        </header>

        {/* 본문 */}
        <div className='flex flex-col w-full p-6 pt-0 space-y-2 overflow-y-auto'>
          {/* 이미지 업로드 */}
          <div className='flex flex-col justify-center items-center relative space-y-0 mb-4'>
            <h3 className='text-base font-medium text-gray-600'>Workspace Image</h3>
            <div className='relative w-full max-w-[300px] aspect-[16/9] overflow-hidden border-2 border-gray-300 rounded-md shadow-sm'>
              <img src={previewImage} alt='Thumbnail Preview' className='object-cover w-full h-full' />
              <button
                onClick={() => document.getElementById('imageUpload').click()}
                className='absolute bottom-2 right-2 bg-white border border-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100'
              >
                <FiUpload className='w-5 h-5' />
              </button>
            </div>
            <input id='imageUpload' type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
          </div>

          {/* 워크스페이스 이름 입력 */}
          <TextInput
            id='projectName'
            label='Workspace Name'
            value={projectName}
            clearable='true'
            onChange={(e) => {
              setProjectName(e.target.value);
              setProjectNameError(''); // 입력 시 에러 초기화
            }}
            required
            error={projectNameError}
          />

          {/* 도메인 주소 입력 */}
          <TextInput
            id='domain'
            label='Server Domain'
            value={domain}
            onChange={(e) => {
              setDomainName(e.target.value);
              setDomainError(''); // 입력 시 에러 초기화
            }}
            required
            error={domainError}
            placeholder='k11b305.ssafy.p.io'
          />

          {/* 설명 입력 */}
          <TextInput
            id='description'
            label='Description'
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionError(''); // 입력 시 에러 초기화
            }}
            helpText='최대 255글자까지 입력 가능합니다.'
            multiline={true}
            error={descriptionError}
          />

          {/* 생성 버튼 */}
          <button
            className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400'
            onClick={createWorkSpaceAPI}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
