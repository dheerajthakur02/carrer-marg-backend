export const internalServerErrorMessage = (res,error) => {
  return res.status(500).json({
    message: "Internal server error",
    error: error.message,
    success: false,
  });
};

