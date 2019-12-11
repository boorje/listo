import * as yup from 'yup';

export default async email => {
  return new Promise(async (resolve, reject) => {
    try {
      const schema = yup.object().shape({
        email: yup
          .string()
          .email()
          .required(),
      });
      await schema.validate({email});
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
