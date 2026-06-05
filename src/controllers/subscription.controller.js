import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { APIerror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { getPagination } from "../utils/pagination.js";

const toggleSubscription = asynchandler(async (req, res) => {
    const { channelId } = req.body;
    if (!channelId) {
        throw new APIerror(400, "Channel id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new APIerror(400, "Invalid channel id");
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new APIerror(400, "Cannot subscribe to yourself");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new APIerror(404, "Channel not found");
    }

    const existing = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    if (existing) {
        await Subscription.findByIdAndDelete(existing._id);
        return res.status(200).json(new Apiresponse(200, { subscribed: false }));
    }

    await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res.status(200).json(new Apiresponse(200, { subscribed: true }));
});

const listSubscribers = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 20,
        sortBy: "createdAt"
    });

    const channelId = req.params.channelId;
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new APIerror(400, "Invalid channel id");
    }

    const subs = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username fullname avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Subscription.countDocuments({ channel: channelId });

    return res.status(200).json(
        new Apiresponse(200, {
            items: subs,
            page,
            limit,
            total
        })
    );
});

const listSubscriptions = asynchandler(async (req, res) => {
    const { page, limit, skip, sort } = getPagination(req.query, {
        limit: 20,
        sortBy: "createdAt"
    });

    const subs = await Subscription.find({ subscriber: req.user._id })
        .populate("channel", "username fullname avatar")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const total = await Subscription.countDocuments({
        subscriber: req.user._id
    });

    return res.status(200).json(
        new Apiresponse(200, {
            items: subs,
            page,
            limit,
            total
        })
    );
});

export { toggleSubscription, listSubscribers, listSubscriptions };
