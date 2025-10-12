'use server';
import connectDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getSessionUser';
import { revalidatePath } from 'next/cache';

async function addMessage(previousState, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    return { error: 'Debes haber iniciado sesión en una cuenta para mandar un mensaje.' };
  }

  const userId = sessionUser.userId;
  const recipient = formData.get('recipient');

  if (userId === recipient) {
    return { error: 'No puedes mandar mensajes en tu propiedad.' };
  }

  const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get('property'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    body: formData.get('message'),
  });

  await newMessage.save();
  
  revalidatePath('/messages', 'page');

  return { submitted: true };
}

export default addMessage;