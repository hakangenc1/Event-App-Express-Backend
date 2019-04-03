import Group from "./model";
import { Meetup } from "../meetups";

export const createGroup = async (req, res) => {
  const { name, description, category } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: true, message: "Name must be provided!" });
  } else if (typeof name !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "Name must be a string!" });
  } else if (name.length < 5) {
    return res.status(400).json({
      error: true,
      message: "Name must contain at least 5 characters long!"
    });
  }

  if (!description) {
    return res
      .status(400)
      .json({ error: true, message: "Description must be provided!" });
  } else if (typeof description !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "Description must be a string!" });
  } else if (description.length < 10) {
    return res.status(400).json({
      error: true,
      message: "Description must contain at least 10 characters long!"
    });
  }

  const group = new Group({ name, description, category });

  try {
    return res.status(201).json({ error: false, group: await group.save() });
  } catch (err) {
    return res
      .status(400)
      .json({ error: true, message: "Error while creating a group!" });
  }
};

export const createGroupMeetup = async (req, res) => {
  const { title, description } = req.body;
  const { groupId } = req.params;

  if (!title) {
    return res
      .status(400)
      .json({ error: true, message: "Title must be provided!" });
  } else if (typeof title !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "Title must be a string!" });
  } else if (title.length < 5) {
    return res.status(400).json({
      error: true,
      message: "Title must contain at least 5 characters long!"
    });
  }

  if (!description) {
    return res
      .status(400)
      .json({ error: true, message: "Description must be provided!" });
  } else if (typeof description !== "string") {
    return res
      .status(400)
      .json({ error: true, message: "Description must be a string!" });
  } else if (description.length < 10) {
    return res.status(400).json({
      error: true,
      message: "Description must contain at least 10 characters long!"
    });
  }

  if (!groupId) {
    return res
      .status(400)
      .json({ error: true, message: "Group Id must be provided!" });
  }

  try {
    const [meetup, group] = await Group.addMeetup(groupId, {
      title,
      description
    });
    return res.status(201).json({ error: false, meetup, group });
  } catch (err) {
    return res
      .status(400)
      .json({ error: true, message: "Meetup cannot be created!" });
  }
};

export const getGroupMeetups = async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res
      .status(400)
      .json({ error: true, message: "Group Id must be provided!" });
  }

  const group = await Group.findById(groupId);

  if (!group) {
    return res.status(400).json({ error: true, message: "Group not exist!" });
  }

  try {
    return res.status(200).json({
      error: false,
      meetups: await Meetup.find({ group: groupId }).populate("group", "name")
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: false, message: "Cannot fetch meetups!" });
  }
};
