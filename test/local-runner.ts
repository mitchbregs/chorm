import "reflect-metadata";
import { schema, client } from "../src/config";
import "../examples/models/User";  // This import will trigger model registration
import "../examples/models/Post";  // This import will trigger model registration
import { User } from "../examples/models/User";
import { Post } from "../examples/models/Post";
import { ClickHouseOrderBy } from "../src/types";

async function runLocalTest() {
  try {
    console.log("Generating schema...");
    await schema.generateSchema();
    console.log("Schema generated successfully");

    console.log("Creating a user...");
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
    console.log("Created user:", user);

    console.log("Creating posts for the user...");
    await Post.create({
      title: "First Post",
      content: "Hello, world!",
      user_id: user.id,
    });
    await Post.create({
      title: "Second Post",
      content: "ClickHouse ORM is awesome!",
      user_id: user.id,
    });
    console.log("Posts created successfully");

    console.log("Fetching user with posts...");
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
    console.log("Fetched user with posts:", JSON.stringify(fetchedUser, null, 2));

    console.log("Updating user...");
    const updatedUser = await User.update({ id: user.id }, { age: 31 });
    console.log("Updated user:", updatedUser);

    console.log("Fetching all posts...");
    const allPosts = await Post.fetch();
    console.log("All posts:", allPosts);

    console.log("Cleaning up...");
    await Post.delete({ user_id: user.id });
    await User.delete({ id: user.id });
    console.log("Cleanup completed");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

runLocalTest();