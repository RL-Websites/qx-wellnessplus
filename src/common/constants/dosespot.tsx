// export const doesSpot = {
//   clinicKey: "GA7ARNR6JCVQ4W2AL5JV75PQEP9Y75HN",
//   randomKey: "dVHrgNplzWDm6z7zXcoMBWMxhMFu2pRN",
//   clinicSsoCode: "dVHrgNplzWDm6z7zXcoMBWMxhMFu2pRNrC6vNgJU9uw2DJavJtCJ2NdnLXdWiI7aPgBvnpfWS8gX%2BWUF%2F%2FMgiOjcU1TWBFMmrbrjCfk09TmtqMo1%2F8k59g",
//   clinicId: "51183",
//   baseUrl: "https://my.dosespot.com/LoginSingleSignOn.aspx",
// };

export const doesSpot = {
  clinicKey: `${import.meta.env.VITE_CLINIC_KEY}`,
  randomKey: import.meta.env.VITE_RANDOM_KEY,
  clinicSsoCode: import.meta.env.VITE_CLINIC_SSOCODE,
  clinicId: import.meta.env.VITE_CLINIC_ID,
  baseUrl: import.meta.env.VITE_DOSESPOT_BASEURL,
};

// export const clinicKey = "DQNWEW3DQYJQ6SNEJH6FPU5TM6Q5DSHA";
// export const randomKey = "dVHrgNplzWDm6z7zXcoMBWMxhMFu2pRN";
// export const clinicSsoCode =
//   "dVHrgNplzWDm6z7zXcoMBWMxhMFu2pRN94FXzuTZCFbCM0B%2BfL2lTNCny4%2FtAfL2n%2FkLsDr5vWo7eb8fW7B0%2BZK7PoJvSYrtMa0A4yzvREgoKzLOjyavYA";
// export const clinicId = "169097";
// export const basrUrl = "http://my.staging.dosespot.com/LoginSingleSignOn.aspx";
