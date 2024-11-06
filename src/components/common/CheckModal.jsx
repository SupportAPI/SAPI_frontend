const CheckModal = ({
  modalTitle = '알림',
  modalContent = '',
  cancleFunction = () => {},
  cancleName = '취소',
  agreeFunction = () => {},
  agreeName = '확인',
  cancleColor = 'bg-gray-200',
  cancleHoverColor = 'bg-gray-500',
  agreeColor = 'bg-red-600',
  agreeHoverColor = 'bg-red-700',
}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-[400px] h-[350px]'>
        <h3 className='text-xl font-bold mb-4'>{modalTitle}</h3>
        <p className='mb-6 h-44' style={{ whiteSpace: 'pre-line' }}>
          {modalContent}
        </p>

        <div className='flex justify-end space-x-4'>
          <button
            onClick={cancleFunction} // 취소 버튼 클릭 시
            className={`px-4 py-2 rounded-md ${cancleColor} hover:!${cancleHoverColor}`}
          >
            {cancleName}
          </button>
          <button
            onClick={agreeFunction} // 확인 버튼 클릭 시
            className={`px-4 py-2 ${agreeColor} hover:${agreeHoverColor} text-white rounded-md `}
          >
            {agreeName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckModal;
