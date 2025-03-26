import { RequestHandler } from 'express';
import ChatMessage from '../models/ChatMessage';

// Planirano da se implementira

// Get All Chats
// Route GET /chats
export const getChats: RequestHandler = async (req, res) => {
  try {
    const chats = await ChatMessage.find().lean().exec();
    if (!chats) {
      return res.status(400).json({ message: 'No chat message found' });
    }
    // res.json(chats);
    res.status(200).json(chats);
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getListMessage: RequestHandler = async (req, res) => {
  try {
    const { shopId, buyerId } = req.params;
    const listMessage = await ChatMessage.find({
      $or: [{ shopId }, { buyerId }],
    })
      .populate('shopId')
      .populate('buyerId');
    res.status(200).json(listMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create Chat Message
// Route POST /chats
export const sendMessage: RequestHandler = async (req, res) => {
  const { shopId, buyerId, text, sentBy } = req.body;
  try {
    const chatMesssage = new ChatMessage({
      shop: shopId,
      buyer: buyerId,
      text,
      sentBy, //izvuci na osnovu logovanog korisnika
    });
    await chatMesssage.save();

    res
      .status(200)
      .json({ success: true, message: 'Message sent succesfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
