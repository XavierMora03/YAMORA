'use server';

import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function deleteMessage(messageId) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error('Se necesita un ID de usuario');
  }

  const { userId } sessionUser.userId;

  const message = await Message.findById(messageId);

  if (!message) throw new Error('No se encontró el mensaje');

  // Verify ownership
  if (message.recipient.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  // revalidate cache
  revalidatePath('/messages', 'page');

  await message.deleteOne();
}

export default deleteMessage;
