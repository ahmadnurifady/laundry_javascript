const responseApi = ({ message = "", data = null, code = 200 }) => {
  return {
    message: message,
    data: data,
    code: code,
  };
};

module.exports = {
    responseApi
}