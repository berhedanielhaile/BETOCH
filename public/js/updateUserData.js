/*eslint-disable*/
export const updateUserData = async (data) => {
  const updatedUser = await axios.patch('/api/v1/user/updateMe', data);
  console.log(updatedUser);
};
