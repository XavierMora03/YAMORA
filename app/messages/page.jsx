import connectDB from '@/config/database';
import Message from '@/models/Message';
import MessageCard from '@/components/MessageCard';
import '@/models/Property';
import { convertToSerializableObject } from '@/utils/convertToObject';
import { getSessionUser } from '@/utils/getSessionUser';

const safeConvert = (doc) => {
  if (!doc) return null;
  try {
    return convertToSerializableObject(doc);
  } catch (err) {
    console.error('Error serializing doc:', err, doc);
    // Fallback para que no truene
    return JSON.parse(JSON.stringify(doc));
  }
};

const MessagePage = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();
  const { userId } = sessionUser;
  console.log(userId);

  const readMessages = await Message.find({ recipient: userId, read: true })
    .sort({ createdAt: -1 })
    .populate('sender', 'username')
    .populate('property', 'name')
    .lean();

  const unreadMessages = await Message.find({ recipient: userId, read: false })
    .sort({ createdAt: -1 })
    .populate('sender', 'username')
    .populate('property', 'name')
    .lean();

  const messages = [...unreadMessages, ...readMessages].map((messageDoc) => {
    const message = safeConvert(messageDoc);
    message.sender = safeConvert(messageDoc.sender);
    message.property = safeConvert(messageDoc.property);
    return message;
  });

  return (
    <section className="bg-purple-50">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Tus mensajes</h1>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>No tienes mensajes</p>
            ) : (
              messages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagePage;
