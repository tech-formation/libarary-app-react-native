import axios from 'axios';

const { CancelToken } = axios;

/**
 * Use to cancel Http Requests
 */
let cancelHttpTokens = [];

/**
 * Helper Params used in Request
 */
const HELPER_PARAMS = {
  callback: null, // Function|Null
  headers: {}, // Additional Headers
};

/**
 * Get Common Headers
 *
 * @param {String} url
 * @param {Object} additional_headers
 *
 * @return {Object} Headers
 */
export const getCommonHeaders = (url, additional_headers = {}) => {
  try {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...additional_headers,
    };
    return headers;
  } catch (e) {
    return {};
  }
};

/**
 * GET Request
 *
 * @param {String} url
 * @param {Object} `HELPER_PARAMS`
 */
export const httpGet = async (url, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .get(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.log('-- HTTP GET -- ', e);
    return Promise.reject({});
  }
};

/**
 * POST Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPost = (
  url,
  params,
  { callback, headers } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .post(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    return httpHandleError(e);
  }
};

/**
 * PUT Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPut = (url, params, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .put(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.log('-- HTTP PUT -- ', e);
    return Promise.reject({});
  }
};

/**
 * PATCH Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} `HELPER_PARAMS`
 */
export const httpPatch = (
  url,
  params,
  { callback, headers } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .patch(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.log('-- HTTP PATCH -- ', e);
    return Promise.reject({});
  }
};

/**
 * DELETE Request
 *
 * @param {String} url
 * @param {Object} `HELPER_PARAMS`
 */
export const httpDelete = (url, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return axios
      .delete(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(res => {
        return httpHandleResponse(res);
      })
      .catch(err => {
        return httpHandleError(err);
      });
  } catch (e) {
    console.log('-- HTTP DELETE -- ', e);
    return Promise.reject({});
  }
};

/**
 * Handle Success Response
 *
 * @param {Object|Null} res
 *
 * @return {Object|Null}
 */
export const httpHandleResponse = res => {
  cancelHttpTokens = [];
  if (!res) return Promise.reject(null);

  const r = res.data;
  return Promise.resolve(r);
};

/**
 * Handle API Error Reponse
 *
 * @param {Object|Null} error
 *
 * @return {Object|String|Null}
 */
export const httpHandleError = error => {
  const xhr = error.request;
  let message = 'Internal server error!';
  if (xhr) {
    switch (xhr.status) {
      case 0:
        message = 'Please check your internet connection!';
        break;

      case 403:
        message = 'Token Expired!';
        break;

      default:
        message = error.response.data.error.message;
        break;
    }
  }
  return Promise.reject(message);
};

/**
 * Shows error message
 * @param {String} message
 */
export const showErrorMsg = message => {
  console.log(message);
};

/**
 * Cancel Http Request
 */
export const httpCancel = () => {
  try {
    cancelHttpTokens.forEach(cancel => cancel());
    cancelHttpTokens = [];
  } catch (e) {
    cancelHttpTokens = [];
  }
};

/**
 * Extract JSON Response
 *
 * @param {JSON} json [JSON Data]
 *
 * @return {Object|String} Extarcted value or Blank Object
 */
export const extractJSON = json => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return '';
  }
};
