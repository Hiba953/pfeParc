import { sessionModel } from "../bd/session.js";
import { SESSION_EXPIRY } from "../constants.js";

export const deserializeUser = async (req, res, next) => {
  const token = req.headers["session-token"];

  if (!token) {
    return next();
  }

  const session = await sessionModel.findOne({
    token,
    validUntil: {
      $gt: new Date(),
    },
  }).populate("user");
  if (!session) {
    return next();
  }
  session.validUntil = new Date(Date.now() + SESSION_EXPIRY);
  res.locals.session = session;
  res.locals.user = session.user;
  res.locals.isLoggedIn = true;

  next();
};

export const requireUser = async (req, res, next) => {
  if (!res.locals.user) {
    return res.status(403).json({
      message: "unauthorized",
    });
  }
  next();
};
