// Category 핸들러
const handleCategoryData = async (data, setApiDocDetail, categoryListRefetch) => {
  console.log(data);
  if (data.actionType === 'ADD' || data.actionType === 'UPDATE' || data.actionType === 'DELETE') {
    await setApiDocDetail(['category', 'categoryId'], data.message.id);
    await setApiDocDetail(['category', 'name'], data.message.value);
  }
  categoryListRefetch();
};

// Category List 핸들러
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
const handleApiNameHandler = (data, setApiDocDetail, userId) => {
  if (data.actionType === 'UPDATE' && data.message.userId != userId) {
    setApiDocDetail(['name'], data.message.value);
  }
};

// API Method 핸들러
const handleApiMethodHandler = async (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    await setApiDocDetail(['method'], data.message.value);
  }
};

// API Path 핸들러
const handlePathHandler = (data, setApiDocDetail, userId) => {
  if (data.actionType === 'UPDATE' && data.message.userId != userId) {
    setApiDocDetail(['path'], data.message.value);
  }
};

// description 핸들러
const handleDescriptionHandler = (data, setApiDocDetail, userId) => {
  if (data.actionType === 'UPDATE' && data.message.userId != userId) {
    setApiDocDetail(['description'], data.message.value);
  }
};

// Parameters
// Auth Type 핸들러
const handleAuthTypeHandler = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['parameters', 'authType'], data.message.value);
  }
};

// Headers 핸들러
const handleHeadersHandler = (data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch) => {
  if (data.actionType === 'ADD' || data.actionType === 'DELETE') {
    apiDocDetailRefetch();
  } else if (data.actionType === 'UPDATE' && userId != data.message.userId) {
    const targetHeaderIndex = apiDocDetail.parameters.headers.findIndex(
      (header) => String(header.id) === String(data.message.id)
    );

    if (targetHeaderIndex === -1) {
      console.warn('Header with the specified id not found:', data.message.id);
      return;
    }

    const updatedApiDocDetail = { ...apiDocDetail };
    const updatedHeaders = [...updatedApiDocDetail.parameters.headers];
    const targetHeader = { ...updatedHeaders[targetHeaderIndex] };

    if (data.message.type === 'KEY') {
      targetHeader.key = data.message.value;
    } else if (data.message.type === 'VALUE') {
      targetHeader.value = data.message.value;
    } else if (data.message.type === 'DESCRIPTION') {
      targetHeader.description = data.message.value;
    } else if (data.message.type === 'REQUIRED') {
      targetHeader.isRequired = data.message.value;
    }

    updatedHeaders[targetHeaderIndex] = targetHeader;
    updatedApiDocDetail.parameters.headers = updatedHeaders;

    setApiDocDetail(updatedApiDocDetail);
  }
};

// Query Parameters 핸들러
const handleQueryParameterData = (data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch) => {
  if (data.actionType === 'ADD' || data.actionType === 'DELETE') {
    apiDocDetailRefetch();
  } else if (data.actionType === 'UPDATE' && userId != data.message.userId) {
    const targetQueryParameterIndex = apiDocDetail.parameters.queryParameters.findIndex(
      (queryParameter) => String(queryParameter.id) === String(data.message.id)
    );

    const updatedApiDocDetail = { ...apiDocDetail };
    const updatedQueryParameters = [...updatedApiDocDetail.parameters.queryParameters];
    const targetQueryParameter = { ...updatedQueryParameters[targetQueryParameterIndex] };

    if (data.message.type === 'KEY') {
      targetQueryParameter.key = data.message.value;
    } else if (data.message.type === 'VALUE') {
      targetQueryParameter.value = data.message.value;
    } else if (data.message.type === 'DESCRIPTION') {
      targetQueryParameter.description = data.message.value;
    } else if (data.message.type === 'REQUIRED') {
      targetQueryParameter.isRequired = data.message.value;
    }

    updatedQueryParameters[targetQueryParameterIndex] = targetQueryParameter;
    updatedApiDocDetail.parameters.queryParameters = updatedQueryParameters;

    setApiDocDetail(updatedApiDocDetail);
  }
};

// Cookies 핸들러
const handleCookieData = (data, apiDocDetail, setApiDocDetail, userId, apiDocDetailRefetch) => {
  if (data.actionType === 'ADD' || data.actionType === 'DELETE') {
    apiDocDetailRefetch();
  } else if (data.actionType === 'UPDATE' && userId != data.message.userId) {
    const targetCookieIndex = apiDocDetail.parameters.cookies.findIndex(
      (cookie) => String(cookie.id) === String(data.message.id)
    );

    const updatedApiDocDetail = { ...apiDocDetail };
    const updatedCookies = [...updatedApiDocDetail.parameters.cookies];
    const targetCookie = { ...updatedCookies[targetCookieIndex] };

    if (data.message.type === 'KEY') {
      targetCookie.key = data.message.value;
    } else if (data.message.type === 'VALUE') {
      targetCookie.value = data.message.value;
    } else if (data.message.type === 'DESCRIPTION') {
      targetCookie.description = data.message.value;
    } else if (data.message.type === 'REQUIRED') {
      targetCookie.isRequired = data.message.value;
    }

    updatedCookies[targetCookieIndex] = targetCookie;
    updatedApiDocDetail.parameters.cookies = updatedCookies;

    setApiDocDetail(updatedApiDocDetail);
  }
};

// Request
// Cookies 핸들러
const handleRequestTypeData = (data, setApiDocDetail) => {
  if (data.actionType === 'UPDATE') {
    setApiDocDetail(['request', 'bodyType'], data.message.value);
  }
};

// Json 핸들러
const handleRequestJsonData = (data, apiDocDetail, setApiDocDetail, userId) => {
  if (data.actionType === 'UPDATE') {
    console.log(data);
    console.log(JSON.parse(data.message));
    // const targetCookieIndex = apiDocDetail.parameters.cookies.findIndex(
    //   (cookie) => String(cookie.id) === String(data.message.id)
    // );
    // const updatedApiDocDetail = { ...apiDocDetail };
    // const updatedCookies = [...updatedApiDocDetail.parameters.cookies];
    // const targetCookie = { ...updatedCookies[targetCookieIndex] };
    // if (data.message.type === 'KEY') {
    //   targetCookie.key = data.message.value;
    // } else if (data.message.type === 'VALUE') {
    //   targetCookie.value = data.message.value;
    // } else if (data.message.type === 'DESCRIPTION') {
    //   targetCookie.description = data.message.value;
    // } else if (data.message.type === 'REQUIRED') {
    //   targetCookie.isRequired = data.message.value;
    // }
    // updatedCookies[targetCookieIndex] = targetCookie;
    // updatedApiDocDetail.parameters.cookies = updatedCookies;
    // setApiDocDetail(updatedApiDocDetail);
  }
};

// RESPONSE
// Response 핸들러
const handleResponse = (data, setApiDocDetail, apiDocDetailRefetch) => {
  if (data.actionType === 'ADD' || data.actionType === 'DELETE') {
    apiDocDetailRefetch();
  }
};

export default {
  handleCategoryData,
  handleCategoryListData,
  handleApiNameHandler,
  handleApiMethodHandler,
  handlePathHandler,
  handleDescriptionHandler,
  handleAuthTypeHandler,
  handleHeadersHandler,
  handleQueryParameterData,
  handleCookieData,
  handleRequestTypeData,
  handleRequestJsonData,
  handleResponse,
};
