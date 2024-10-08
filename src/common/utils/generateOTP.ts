export const generateOTP = () => {
  const isDev = process.env.OTP_ENV === 'dev';
  
return isDev ? '88888' : Math.floor(10000 + Math.random() * 90000).toString();
};
