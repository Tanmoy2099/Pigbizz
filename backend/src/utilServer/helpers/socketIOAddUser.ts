const users: { userId: any; socketId: any }[] = [];

const addUser = async (userId: number, socketId: string) => {
  const user = users.find((user) => user.userId === userId);

  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId);
    }

    const newUser = { userId, socketId };
    users.push(newUser);
    return users;
  }
};

const removeUser = async (socketId: any) => {
  const indexOf = users.map((user) => user.socketId).indexOf(socketId);
  users.splice(indexOf, 1);

  return;
};

const findConnectedUser = (userId: any) =>
  users.find((user) => user.userId === userId);

module.exports = { addUser, removeUser, findConnectedUser, users };
