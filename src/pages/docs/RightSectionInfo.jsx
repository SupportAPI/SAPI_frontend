const RightSectionInfo = ({ createdData, lastModifiedDate }) => {
  return (
    <div className='flex flex-col mb-4'>
      <p className='text-2xl font-bold mb-4'>API INFO</p>
      <p className='text-lg font-bold mb-2'>Created</p>
      <span className='text-sm mx-1 ml-1 mb-3'>
        {new Date(createdData).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <p className='text-lg font-bold mb-2'>Last Updated</p>
      <span className='text-sm mx-1 ml-1'>
        {new Date(lastModifiedDate).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  );
};

export default RightSectionInfo;
