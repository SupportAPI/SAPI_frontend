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

  // 선택된 categoryId를 저장할 상태 추가
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    listRefetch(workspaceId);
  }, [workspaceId]);

  // environmentList가 로드된 후 가장 낮은 categoryId를 기본 선택 값으로 설정
  useEffect(() => {
    if (environmentList && environmentList.length > 0) {
      const minCategoryId = Math.min(...environmentList.map((env) => env.categoryId));
      setSelectedCategoryId(minCategoryId);
    }
  }, [environmentList]);

  // 선택된 categoryId가 있을 때만 useFetchEnvironment 쿼리를 활성화
  //   const {
  //     data: environmentData,
  //     isLoading: isDataLoading,
  //     error: isDataError,
  //     refetch: envRefetch,
  //   } = useFetchEnvironment(selectedCategoryId);

  const handleEnvironmentChange = (e) => {
    const pickEnvironmentId = e.target.value;
    // setSelectedCategoryId(pickEnvironmentId); // 선택한 ID를 상태로 설정
  };

  //   useEffect(() => {
  //     if (selectedCategoryId) {
  //       envRefetch(); // 데이터 재요청
  //     }
  //   }, [selectedCategoryId, envRefetch]);

  // environmentData가 업데이트될 때 useEnvironmentStore에 저장
  //   useEffect(() => {
  //     if (environmentData) {
  //       setEnvironment(environmentData); // 환경 데이터를 store에 저장
  //     }
  //   }, [environmentData, setEnvironment]);

  return (
    <select value={selectedCategoryId || ''} onChange={handleEnvironmentChange}>
      <option value=''>Select Environment</option>
      {environmentList &&
        environmentList.map((env) => (
          <option key={env.categoryId} value={env.categoryId}>
            {env.categoryName}
          </option>
        ))}
    </select>
  );
};

export default Environment;
