import axios from 'axios';

export const findIndex = async (specificationId) => {
  const response = await axios.get(`http://localhost:8080/comments/index`, {
    params: { specificationId: specificationId },
  });
  return response.data;
};

export const findComments = async (specificationId, id, size, userNickname) => {
  try {
    console.log(
      `Requesting: /comments?specificationId=${specificationId}&id=${id}&size=${size}&userNickname=${userNickname}`
    );
    const response = await axios.get(`http://localhost:8080/comments`, {
      params: {
        specificationId: specificationId,
        id: id,
        size: size,
        userNickname: userNickname,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
};

export const findUsers = async (nickname) => {
  try {
    console.log(nickname);
    const response = await axios.get(`http://localhost:8080/users`, {
      params : {nickname}
    });
    return response.data;
  }catch (error) {
    console.error('Find comments error:', error);
    throw error;
  }
}