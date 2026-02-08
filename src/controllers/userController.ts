import { Request, Response } from "express";
import User from "../models/user.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role, search, limit, sort, page, minAge, maxAge } = req.query;
    let filter: Record<string, unknown> = {};

    if (role) {
      filter.role = role;
    }

    if (minAge || maxAge) {
      if (minAge) {
        (filter.age as Record<string, Number>).$gte = Number(minAge);
      }
      if (maxAge) {
        (filter.age as Record<string, Number>).$lte = Number(maxAge);
      }
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 0;
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(filter)
      .sort(sort as string)
      .limit(limitNum)
      .skip(skip);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: `Couldn't fetch the users`,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: `Couldn't find a user with id: ${req.params.id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `User with id: ${req.params.id} was found`,
      data: user,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      res.status(400).json({
        success: false,
        error: "Invalid ID Format",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Server.error",
      });
    }
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    if (!user) {
      res.status(400).json({
        success: false,
        error: `Couldn't create user`,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: `User with Name: ${user.fullName} was Created Successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Side Error. Please, Try Again later!",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({ success: false, error: `User not found` });
  }
};

export const patchUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: `User with ID ${req.params.id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
};
