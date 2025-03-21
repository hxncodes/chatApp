import Conversation from "../models/conversation.model.js";
import Message from "../models/messag.model.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find the conversation between the sender and receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    // Log the conversation and messages to debug
    // console.log("Conversation:", conversation);
    // console.log("Messages:", conversation ? conversation.messages : []);

    // If no conversation exists, return error
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const messages = conversation.messages;

    // Return the populated messages
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // Assuming _id is stored in req.user

    // Validate the inputs
    if (!message || !senderId || !receiverId) {
      return res
        .status(400)
        .json({ error: "Message, senderId, and receiverId are required" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    // Create the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id); // Add the message to the conversation
    }

    //TODO: Socket.io functionality

    // Saving the message and conversation in db
    Promise.all([conversation.save(), newMessage.save()]);

    // Send the response back
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     // Find conversation between the sender and the receiver
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] },
//     });

//     // If conversation doesn't exist, create a new one
//     if (!conversation) {
//       conversation = new Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     // Create a new message
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });

//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }

//     // this will run in parallel
//     await Promise.all([conversation.save(), newMessage.save()]);

//     // SOCKET IO FUNCTIONALITY WILL GO HERE
//     // const receiverSocketId = getReceiverSocketId(receiverId);
//     // if (receiverSocketId) {
//     //   // io.to(<socket_id>).emit() used to send events to specific client
//     //   io.to(receiverSocketId).emit("newMessage", newMessage);
//     // }

//     // Send the new message back in the response
//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error("Error in sendMessage controller:", error.message);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
