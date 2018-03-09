const dev = {
  s3: {
    BUCKET: ""
  },
  apiGateway: {
    REGION: "",
    URL: ""
  },
  cognito: {
    USER_POOL_ID: "",
    APP_CLIENT_ID: "",
    REGION: "",
    IDENTITY_POOL_ID: ""
  }
};

const prod = {
  s3: {
    BUCKET: ""
  },
  apiGateway: {
    URL: "",
    REGION: ""
  },
  cognito: {
    USER_POOL_ID: "",
    APP_CLIENT_ID: "",
    REGION: "",
    IDENTITY_POOL_ID: ""
  }
};

const config = process.env.REACT_APP_STAGE === "production"
  ? prod
  : dev;


export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
  smImageConfig: {
    quality: 0.75,
    maxWidth: 800,
    maxHeight: 2000
  },
  mdImageConfig: {
    quality: 0.75,
    maxWidth: 1200,
    maxHeight: 2000
  },
  lgImageConfig: {
    quality: .75,
    maxWidth: 1920,
    maxHeight: 2000
  }
};
