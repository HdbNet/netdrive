const enoent = (err, req, res, next) => {
    console.log(err);
    if (err.code === 'ENOENT') {
      err.message = 'No such file or directory';
      err.code = 400;
    }

    res.status(err.code || 500).json({
      message: err.message,
      success: false
    });
};

module.exports = enoent;