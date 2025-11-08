import jwt from "jsonwebtoken";
const generateToken = (id, role, profileId) => {
  return jwt.sign({ id, role, profileId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export default generateToken;
