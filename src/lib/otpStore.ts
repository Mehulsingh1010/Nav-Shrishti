// lib/otpStore.ts
type OtpRecord = {
    otp: string;
    expires: number;
  };
  
  const otpStore: Record<string, OtpRecord> = {};
  
  export default otpStore;
  