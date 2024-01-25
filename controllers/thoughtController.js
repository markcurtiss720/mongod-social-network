const { Thought, User } = require("../models");

module.exports = {

  async getThought(req, res) {
    try {
      const thoughtData = await Thought.find();
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thoughtData = await Thought.findOne({
        _id: req.params.thoughtId,
      });
      if (!thoughtData) {
        return res.status(404).json({ message: "No Thought found with this ID" });
      }
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const thoughtData = await Thought.create(req.body);
      const userData = await User.findOneAndUpdate(
        { _id: req.body.username },
        { $addToSet: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!userData) {
        return res
          .status(404)
          .json({ message: "No User found with this ID" });
      }
      res.json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        {
          _id: req.params.thoughtId,
        },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thoughtData) {
        return res.status(404).json({ message: "No Thought found with this ID" });
      }
      res.json({ message: "Updated Thought" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thoughtData = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thoughtData) {
        return res.status(404).json({ message: "No Thought found with this ID" });
      }
      const userData = await User.findOneAndUpdate(
        { _id: thoughtData.username },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!userData) {
        return res
          .status(404)
          .json({ message: "Thought deleted. No User found with this ID" });
      }
      res.status(200).json({ message: "Thought Deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const thoughtData = await Thought.findOne({
        _id: req.params.thoughtId,
      });
      if (!thoughtData) {
        return res.status(404).json({ message: "No Thought found with this ID" });
      }
      const userData = await User.findOne({
        _id: thoughtData.username,
      });

      thoughtData.reactions.push(req.body);
      await thoughtData.save();
      res.json(thoughtData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thoughtData) {
        return res.status(404).json({ message: "No Thought found with this ID" });
      }
      res.json({ message: "Reaction deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};