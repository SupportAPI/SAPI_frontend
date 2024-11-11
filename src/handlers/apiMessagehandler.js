import ApiDocsDetail from '../pages/ApiDocsDetail';

// 쿼리 파라미터 핸들러
const handleQueryParameterData = (message, setApiDocDetail) => {};

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

export default {
  handleQueryParameterData,
  handleCategoryData,
  handleCategoryListData,
  handleApiNameHandler,
};
