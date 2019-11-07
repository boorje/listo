import {createUser, getUser} from '../api/authAPI';

/**
 * Checks if the user exists in the database
 * @param {String} id
 * @returns {Boolean} boolean
 */
const _userExistsInDB = async id => {
  return new Promise(async resolve => {
    try {
      await getUser(id);
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  });
};

/**
 * Adds the user to the db if the user doesn't already exist
 * @param {Object} user
 * @returns void
 */
export const addUserToDB = async user => {
  const id = user.sub;
  const exists = await _userExistsInDB(id);
  if (!exists) {
    const {email} = user;
    await createUser({id, email});
  }
};

/**
 * Adds a new user to the db
 * @param {Object} user
 * @returns void
 */
export const addNewUserToDB = async user => {
  const id = user.sub;
  const {email} = user;
  await createUser({id, email});
};

export default addUserToDB;
