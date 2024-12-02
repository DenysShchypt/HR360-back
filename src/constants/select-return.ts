type UserSelectFields = {
  email: true;
  username: true;
  id: true;
  photo?: true;
  password?: true;
  verifyLink: true;
};

type UserAllData = UserSelectFields & { password: true };

export const USER_SELECT_FIELDS: UserSelectFields = {
  email: true,
  username: true,
  id: true,
  photo: true,
  verifyLink: true,
};

export const USER_ALL_DATA: UserAllData = {
  ...USER_SELECT_FIELDS,
  password: true,
};
