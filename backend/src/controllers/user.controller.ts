import { request, Request, Response } from "express";
import * as userService from "../services/user.service";
import * as authService from "../services/auth.service";
import * as connectionService from "../services/connection.service";
import * as connRequestService from "../services/connrequest.service";
import * as feedService from "../services/feed.service";
import "../utils/bigIntUtils";
const fs = require('fs');
const path = require('path');

export const getAllUsers = async (req, res) => {
  try {
    const querySearch = req.query.searchQuery;
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;
    let userId = 0;
    let access = "public";
    if (!req.user) {
      userId = 0;
    } else {
      access = "authenticated"
      userId = req.user.userId;
    }

    const { users, nextCursor } = await userService.fetchUsers(querySearch, userId, cursor, limit);
  
    return res.status(200).json({
      success: true,
      message:"User list fetched successfully",
      body: {
        access: access,
        data: users,
        nextCursor: nextCursor,
      }
    })
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || "Something went wrong while fetching users.",
      error: e,
    })
  }
}

export const getSelfProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not logged in",
        error: null,
      });
    }
    const id = req.user.userId;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: null,
      });
    }
    const response = {
      success: true,
      message: "User data fetched successfully",
    };
    const responseBody = {
      id: req.user.userId,
      username: user.username,
      name: user.full_name,
      profile_photo: user.profile_photo_path,
    };
    return res.status(200).json({
      ...response,
      body: responseBody,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || "Something went wrong while fetching users.",
      error: e,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    const feed = await feedService.getFeedProfile(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: null,
      });
    }
    const countConnection = await connectionService.countMutualConnections(id);
    const response = {
      success: true,
      message: "User data fetched successfully",
    };
    const responseBody = {
      username: user.username,
      name: user.full_name,
      work_history: user.work_history,
      skills: user.skills,
      connection_count: countConnection,
      profile_photo: user.profile_photo_path,
      access: req.access,
    };

    if (req.access === "public") {
      return res.status(200).json({
        ...response,
        body: responseBody,
      });
    } else if (req.access === "unconnected") {
      const statusRequest = await connRequestService.getConnRequest(
        id,
        req.user.userId,
      );
      let request = "";
      if (statusRequest) {
        request = "pending";
      } else {
        const sendRequest = await connRequestService.getConnRequest(
          req.user.userId,
          id,
        );
        if (sendRequest) {
          request = "sent";
        }
      }
      return res.status(200).json({
        ...response,
        body: {
          ...responseBody,
          relevant_posts: feed,
          status_request: request,
        },
      });
    } else {
      return res.status(200).json({
        ...response,
        body: {
          ...responseBody,
          relevant_posts: feed,
        },
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || "Something went wrong while fetching users.",
      error: e,
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      name: fullname,
      password,
    } = req.body;
    const newUser = await userService.createUser(
      username,
      email,
      fullname,
      password,
    );
    const payload = {
      userId: newUser.id,
      email: newUser.email,
    };

    const generatedToken = authService.generateToken(payload);

    res.cookie("token", generatedToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      body: {
        token: generatedToken,
      },
    });
  } catch (e) {
    if (e.code === "P2002") {
      res.status(409).json({
        success: false,
        message:
          e.message || "User with the given username or email already exists.",
        error: e,
      });
    }

    res.status(500).json({
      success: false,
      message: e.message || "Something went wrong while creating the user.",
      error: e,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user
    let user = await userService.getUserByUsername(identifier);
    if (!user) {
      user = await userService.getUserByEmail(identifier);
    }

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Incorrect username/email or password",
        error: null,
      });
    }

    // Check password
    const isMatch = await authService.comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Incorrect username/email or password",
        error: null,
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };
    const generatedToken = authService.generateToken(payload);

    res.cookie("token", generatedToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      body: {
        token: generatedToken,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || "Internal Server Error",
      error: e,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    body: {
    },
  });
}

export const updateUser = async (req, res) => {
  try {
    if (req.access == "public") {
      return res.status(401).json({
        success: false,
        message: "You're not authenticated, log in to continue",
        error: null,
      })
    }

    if (req.access !== "owner") {
      return res.status(401).json({
        success: false,
        message: "You're not allowed to access this resource",
        error: null,
      })
    }
    const { username, name, workHistory, skills, new_profile_photo, profile_photo } = req.body;

    const updatedData = {
      username: username,
      full_name: name,
      work_history: workHistory,
      skills: skills,
      profile_photo_path: new_profile_photo || profile_photo || "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Sample_User_Icon.png/120px-Sample_User_Icon.png",
    };

    const updatedUser = await userService.updateUserData(req.user.userId, updatedData);

    res.status(200).json({
      success: true,
      message: "User data updated successfully",
      body: {
        username: updatedUser.username,
        name: updatedUser.full_name,
        work_history: updatedUser.work_history,
        skills: updatedUser.skills,
        profile_photo: updatedUser.profile_photo_path,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message || "An error occurred while updating the user.",
      error: e,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    await userService.deleteUserById(userId);

    res.status(204).send();
  } catch (e) {
    res.status(500).json({
      error: "Internal Server Error",
      message: e.message,
    });
  }
};
