import { User } from './models/User';
import { Post } from './models/Post';
import { schema } from '../src/config';
import { ClickHouseOrderBy } from '../src/types';
import { v4 as uuidv4 } from 'uuid';

async function runRelationsExamples() {
  // Generate schema
  await schema.generateSchema();

  // Create a user with posts
  const user = await User.create({
    id: uuidv4(),
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 28,
    created_at: new Date()
  });

  // Create posts for the user
  await Post.create({
    title: 'First Post',
    content: 'Hello!',
    user_id: user.id,
    created_at: new Date()
  });

  await Post.create({
    title: 'Second Post',
    content: 'World!',
    user_id: user.id,
    created_at: new Date(Date.now() + 1000) // 1 second later
  });

  // Fetch user with posts, ordered by creation date descending
  const fetchedUser = await User.fetch(
    { id: user.id },
    {
      limit: 1,
      include: {
        posts: {
          orderBy: { created_at: ClickHouseOrderBy.DESC }
        }
      }
    }
  );
  console.log('Fetched user with posts:', JSON.stringify(fetchedUser, null, 2));

  // Fetch all users with their posts, users ordered by name ascending
  const allUsers = await User.fetch(undefined, {
    orderBy: { name: ClickHouseOrderBy.ASC },
    include: {
      posts: {
        orderBy: { created_at: ClickHouseOrderBy.DESC }
      }
    }
  });
  console.log('All users with their posts:', JSON.stringify(allUsers, null, 2));

  // Clean up
  await Post.delete({ user_id: user.id });
  await User.delete({ id: user.id });
  console.log('Cleaned up data');
}

runRelationsExamples().catch(console.error);