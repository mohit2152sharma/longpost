import { BskyAgent } from '@atproto/api';

const bskyPost = async (post: string) => {
  const agent = new BskyAgent({ service: "https://bsky.social" })
  await agent.post({
    text: 'Hello world! I posted this via the API.',
    createdAt: new Date().toISOString()
  })
}
