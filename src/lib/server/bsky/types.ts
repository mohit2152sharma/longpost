import { z } from 'zod'
import { RichText } from "@atproto/api";

const LoginCredentialsSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

interface AuthResponse {
  token: string;
}

interface User {
  isAuthenticated: boolean;
  token: string | null;
}

type LoginCredentialsSchemaType = z.infer<typeof LoginCredentialsSchema>;


interface BskyPost {
  $type: string;
  text: string;
  facets?: RichText["facets"];
  createdAt: string;
  reply?: BskyReply;
}

interface ParsedValues {
  content: string;
  shoutout: boolean;
}

interface BskyPostResponse {
  uri: string;
  cid: string;
  commit: {
    cid: string;
    rev: string;
  };
  validationStatus: string;
}

interface SessionData {
  accessJwt: string;
  did: string;
}

interface CreateRecordRequest {
  repo: string;
  collection: string;
  record: BskyPost;
}

interface Reply {
  uri: string;
  cid: string;
}

interface BskyReply {
  root?: Reply;
  parent?: Reply;
}

export {
  LoginCredentialsSchema,
  type LoginCredentialsSchemaType,
  type AuthResponse,
  type User,
  type BskyPostResponse,
  type BskyPost,
  type SessionData,
  type CreateRecordRequest,
  type BskyReply,
  type ParsedValues,
}
