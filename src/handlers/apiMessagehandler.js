// 카테고리 핸들러
const handleCategoryData = (data, setApiDocDetail) => {
  if (data.actionType === 'ADD' || data.actionType === 'UPDATE') {
    setApiDocDetail(['category', 'categoryId'], data.message.id);
    setApiDocDetail(['category', 'name'], data.message.value);
  } else if (data.actionType === 'DELETE') {
    setApiDocDetail(['category', 'categoryId'], 0);
    setApiDocDetail(['category', 'name'], '미설정');
  }
};

// 카테고리 목록 핸들러
const handleCategoryListData = (data, setCategoryList) => {
  const newCategory = {
    categoryId: data.message.id,
    name: data.message.value,
  };

  if (data.actionType === 'ADD') {
    setCategoryList((prevList) => [...prevList, newCategory]);
  } else if (data.actionType === 'DELETE') {
    setCategoryList((prevList) => prevList.filter((category) => category.categoryId !== data.message.id));
  } else if (data.actionType === 'UPDATE') {
    return;
  }
};

// API NAME 핸들러
const handleApiNameHandler = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['name'], data.message.value);
  }
};

// API Path 핸들러
const handleApiMethodHandler = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['method'], data.message.value);
  }
};

// API Path 핸들러
const handlePathHandler = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['path'], data.message.value);
  }
};

// Descriptio 핸들러
const handleDescriptionHandler = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['description'], data.message.value);
  }
};

////// Parameter 영역

// Auth Type 핸들러
const handleAuthTypeHandler = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['parameters', 'authType'], data.message.value);
  }
};

// 쿼리 파라미터 핸들러
const handleQueryParameterData = (data, setApiDocDetail, refetch) => {
  if (data.actionType === 'DELETE' || data.actionType === 'ADD') {
    refetch(); // 이거 다시 고쳐줘야함
  } else {
    const parsedValue = JSON.parse(data.message.value);

    setApiDocDetail(['parameters', 'queryParameters'], parsedValue);
  }
};

export default {
  handleQueryParameterData,
  handleCategoryData,
  handleCategoryListData,
  handleApiNameHandler,
  handleApiMethodHandler,
  handlePathHandler,
  handleDescriptionHandler,
  handleAuthTypeHandler,
};
