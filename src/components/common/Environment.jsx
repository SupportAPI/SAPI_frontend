import { useFetchEnvironment, useFetchEnvironmentList } from '../../api/queries/useEnvironmentQueries';
import { useEffect, useState } from 'react';
import { useEnvironmentStore } from '../../stores/useEnvironmentStore';

const Environment = ({ workspaceId }) => {
  const {
    data: environmentList,
    isLoading: isListLoading,
    error: isListError,
    refetch: listRefetch,
  } = useFetchEnvironmentList(workspaceId);

  const { environment, setEnvironment } = useEnvironmentStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // workspaceId 변경 시 리스트 refetch
  useEffect(() => {
    if (workspaceId) {
      listRefetch();
    }
  }, [workspaceId]);

  // 환경 목록 로드 후 가장 낮은 categoryId를 기본 선택 값으로 설정
  useEffect(() => {
    if (environmentList && environmentList.length > 0 && selectedCategoryId === null) {
      const minCategoryId = Math.min(...environmentList.map((env) => env.id));
      setSelectedCategoryId(minCategoryId);
    }
  }, [environmentList]);

  // 선택된 categoryId가 있을 때만 쿼리 활성화
  const {
    data: environmentData,
    isLoading: isDataLoading,
    error: isDataError,
  } = useFetchEnvironment(selectedCategoryId);

  const handleEnvironmentChange = (e) => {
    setSelectedCategoryId(Number(e.target.value));
  };

  // environmentData가 업데이트될 때 useEnvironmentStore에 저장
  useEffect(() => {
    if (environmentData) {
      setEnvironment(environmentData);
      console.log(environmentData);
    }
  }, [environmentData, setEnvironment]);

  return (
    <select
      className='dark:bg-dark-background dark:text-dark-text light:bg-light-background light:text-light-text mr-3 font-semibold'
      value={selectedCategoryId || ''}
      onChange={handleEnvironmentChange}
    >
      <option value=''>Environment Variable</option>
      {environmentList &&
        environmentList.map((env) => (
          <option key={env.id} value={env.id}>
            {env.name}
          </option>
        ))}
    </select>
  );
};

export default Environment;
