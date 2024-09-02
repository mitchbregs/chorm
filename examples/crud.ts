import { User } from './models/User';
import { Post } from './models/Post';
import { schema } from '../src/config';
import { v4 as uuidv4 } from 'uuid';

async function runCRUDExamples() {
  // Generate schema
  await schema.generateSchema();

  // Create a user
  const user = await User.create({
    id: uuidv4(),
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    created_at: new Date()
  });
  console.log('Created user:', user);

  // Fetch all users
  const allUsers = await User.fetch();
  console.log('All users:', allUsers);

  // Fetch one user
  const fetchedUser = await User.fetch({ id: user.id }, { limit: 1 });
  console.log('Fetched user:', fetchedUser);

  // Update user
  const updatedUser = await User.update({ id: user.id }, { age: 31 });
  console.log('Updated user:', updatedUser);

  // Create a post for the user
  const post = await Post.create({
    title: 'My First Post',
    content: 'Hello, world!',
    user_id: user.id,
    created_at: new Date()
  });
  console.log('Created post:', post);

  // Fetch posts for the user
  const userPosts = await Post.fetch({ user_id: user.id });
  console.log('User posts:', userPosts);

  // Delete the post
  await Post.delete({ id: post.id });
  console.log('Deleted post');

  // Delete the user
  await User.delete({ id: user.id });
  console.log('Deleted user');
}

runCRUDExamples().catch(console.error);