const User = require("../models/User");
const Thought = require("../models/Thought");

module.exports = {
  async getUser(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        "-__v"
      );

      if (!user) {
        return res.status(404).json({ message: "No User found with this ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const userData = await User.create(req.body);
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        req.body,
        {
          new: true,
        }
      );
      if (!userData) {
        res.status(404).json({ message: "No User found with this ID" });
        return;
      }
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const userData = await User.findOne({
        _id: req.params.userId,
      });
      if (!userData) {
        res.status(404).json({ message: "No User found with this ID" });
        return;
      }

      const thoughts = await Thought.find({
        username: req.params.userId,
      });
      if (thoughts.length > 0) {
        for (const thought of thoughts) {
          await thought.remove();
        }
      }

      await User.deleteOne({ _id: req.params.userId });

      res.json({ message: "User Deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const friendData = await User.findOne({ _id: req.params.friendId });
      if (!friendData) {
        res.status(404).json({ message: "No User found with this ID" });
        return;
      }

      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $push: { friends: friendData._id },
        },
        {
          new: true,
        }
      );

      res.json(userData);
    } catch (err) {
      res.json(500).json(err);
    }
  },
  
  async deleteFriend(req, res) {
    try {
      const friendData = await User.findOne({ _id: req.params.friendId });
      if (!friendData) {
        res.status(404).json({ message: "No User found with this ID" });
        return;
      }

      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $pull: { friends: friendData._id },
        },
        {
          new: true,
        }
      );

      res.json(userData);
    } catch (err) {
      res.json(500).json(err);
    }
  },
};