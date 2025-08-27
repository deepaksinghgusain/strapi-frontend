export const environment = {
  production: false,
  apibaseurl: 'https://admin.cpewlearning.com',
  imageEndPoint: 'https://admin.cpewlearning.com',
  twilioAgentIdentity: "cpetest000@outlook.com",
  rotoken: 'c8b1d87cd63f1bddf04e81c6e8f9d80d773afc7db69088a72d20bf367dbbdc2f6ef77a005e3ef8ceaa3e0ac42e180211dacbb5ba831268b3a4f2b8af0906957a7bf011dca558522131f15d7eae6055c9df7ba3653b03c12ff2dafed99244d8f5607ea8392ada2f0ae73df23c2202ec58c982a01cfeda1bb1e1384cc03ef181b6',
  
  GA_TRACKING_ID: 'G-JZV3CK13LP',
  
  muxVideoEnv:"",
  urlNews: './assets/params/json/mock/trailers.json',
  urlMovies: './assets/params/json/mock/movies.json',

  /* urlNews: 'http://localhost:5004/trailers', */
  // url: 'https://api.ganatan.com/tutorials',
 
  config: {
    /* SELECT ONE OF THOSE CONFIGURATIONS */

/* LOCAL JSON (NO CRUD) */
api: false,
url: './assets/params/json/crud/',

/* LOCAL REST API CRUD WITH POSTGRESQL */
/* api: true,
url: 'http://localhost:5004/', */
  },
};