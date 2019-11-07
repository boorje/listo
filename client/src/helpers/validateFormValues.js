import * as yup from 'yup';

export default async ({email, password}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = yup.object().shape({
        email: yup
          .string()
          .email()
          .required(),
        password: yup
          .string()
          .min(8)
          .required(),
      });
      await schema.validate({email, password});
      resolve();
    } catch (error) {
      const {message, name} = error;
      reject({
        code: name,
        message: message.charAt(0).toUpperCase() + message.slice(1),
      });
    }
  });
};
