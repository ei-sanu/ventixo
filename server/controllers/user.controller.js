import { syncUser, getUserProfile } from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const syncCurrentUser = asyncHandler(async (req, res) => {
  const result = await syncUser({
    clerkId: req.clerkId,
    username: req.body.username,
  });

  return res.status(result.created ? 201 : 200).json({
    success: true,
    message: result.created ? "User synced successfully" : "User already synced",
    data: {
      user: result.user,
    },
  });
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user._id);

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});
