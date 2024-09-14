/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BACKEND_API_URL: string;
    REACT_APP_API_TIMEOUT: string;
    REACT_APP_IMP_VALUE: string;
  }
}
