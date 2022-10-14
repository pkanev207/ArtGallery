exports.getErrorMessage = (err) => {
    let errorMessage = err.message;
    // console.log(err);
    if (err.errors) {
        errorMessage = Object.values(err.errors)[0].message;
    }

    return errorMessage;
};
