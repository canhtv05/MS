'use client';

import protobuf from 'protobufjs';

const PROTO_URL = '/proto/socket.proto';

let cachedType: protobuf.Type | null = null;
let loadPromise: Promise<protobuf.Type> | null = null;

/** Load proto từ file public/proto/socket.proto, cache và trả về WsMessageProto type. */
async function getMessageTypeAsync(): Promise<protobuf.Type> {
  if (cachedType) return cachedType;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const res = await fetch(PROTO_URL);
    if (!res.ok) throw new Error(`Failed to load ${PROTO_URL}: ${res.status}`);
    const protoSource = await res.text();
    const result = protobuf.parse(protoSource) as { root: protobuf.Root } | protobuf.Root;
    const root = 'root' in result && result.root ? result.root : (result as protobuf.Root);
    const type = root.lookupType('WsMessageProto');
    if (!type) throw new Error('WsMessageProto not found in proto file');
    cachedType = type;
    return type;
  })();
  return loadPromise;
}

/** Map frontend WsType string enum to proto number (match backend). */
const STRING_TO_PROTO: Record<string, number> = {
  PING: 1,
  PONG: 2,
  SUBSCRIBE: 3,
  UNSUBSCRIBE: 4,
  KICK: 5,
  ERROR: 6,
  MESSAGE: 7,
  RESPONSE_API: 8,
  FRIEND_REQUEST: 9,
};

const PROTO_TO_STRING: Record<number, string> = Object.fromEntries(
  Object.entries(STRING_TO_PROTO).map(([k, v]) => [v, k]),
);

export type WsMessagePayload = {
  type: string;
  topic?: string;
  userId?: string;
  message?: string;
  data?: string;
};

/** Encode payload to protobuf bytes (Uint8Array). Dùng proto file public/proto/socket.proto. */
export async function encodeWsMessage(payload: WsMessagePayload): Promise<Uint8Array> {
  const type = await getMessageTypeAsync();
  const protoType = STRING_TO_PROTO[payload.type] ?? 0;
  const err = type.verify({
    type: protoType,
    topic: payload.topic ?? '',
    userId: payload.userId ?? '',
    message: payload.message ?? '',
    data: payload.data ?? '',
  });
  if (err) throw new Error(err);
  const msg = type.create({
    type: protoType,
    topic: payload.topic ?? '',
    userId: payload.userId ?? '',
    message: payload.message ?? '',
    data: payload.data ?? '',
  });
  return type.encode(msg).finish();
}

/** Decode protobuf bytes to payload. Nhận dữ liệu dạng byte (ArrayBuffer | Uint8Array). Dùng proto file public/proto/socket.proto. */
export async function decodeWsMessage(bytes: ArrayBuffer | Uint8Array): Promise<WsMessagePayload> {
  const type = await getMessageTypeAsync();
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const decoded = type.decode(arr) as unknown as {
    type: number;
    topic: string;
    userId: string;
    message: string;
    data: string;
  };
  const typeStr = PROTO_TO_STRING[decoded.type] ?? 'MESSAGE';
  return {
    type: typeStr,
    topic: decoded.topic || undefined,
    userId: decoded.userId || undefined,
    message: decoded.message || undefined,
    data: decoded.data || undefined,
  };
}
