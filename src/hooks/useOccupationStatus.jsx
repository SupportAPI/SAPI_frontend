export const useOccupationStatus = (occupationState = [], userId) => {
  const getOccupationData = (componentId) => {
    // occupationState가 배열인지 확인 후 find 호출
    if (!Array.isArray(occupationState)) {
      console.error('occupationState가 배열이 아닙니다. 기본값으로 처리합니다.', occupationState);
      return null;
    }
    return occupationState.find((item) => item.componentId === componentId);
  };

  const checkOccupation = (componentId) => {
    const data = getOccupationData(componentId);

    const isOccupiedByMe = data?.userId == userId;
    const isOccupiedByOthers = data && !isOccupiedByMe;
    const isOccupied = !!data;

    // 각 데이터 개별 반환
    const nickname = data?.nickname || null;
    const profileImage = data?.profileImage || null;
    const color = data?.color || null;

    return {
      isOccupiedByMe,
      isOccupiedByOthers,
      isOccupied,
      nickname,
      profileImage,
      color,
    };
  };

  return checkOccupation;
};
