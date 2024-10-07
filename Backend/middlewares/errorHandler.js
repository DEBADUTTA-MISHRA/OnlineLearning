const { handleErrorResponse } = require('../helpers/responseHelper');

module.exports = (err, req, res, next) => {
    console.error(err.message);
    handleErrorResponse(res, err.statusCode || 500, err.message || 'Internal Server Error');
};
