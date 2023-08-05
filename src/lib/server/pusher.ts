import Pusher from "pusher"
import { PUSHER_KEY, PUSHER_APP_ID, PUSHER_CLUSTER, PUSHER_SECRET } from "$env/static/private"

export const pusher = new Pusher({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    // useTLS: true,
    cluster: PUSHER_CLUSTER, // if `host` is present, it will override the `cluster` option.
    // host: "HOST", // optional, defaults to api.pusherapp.com
    // port: PORT, // optional, defaults to 80 for non-TLS connections and 443 for TLS connections
    // encryptionMasterKeyBase64: ENCRYPTION_MASTER_KEY, // a base64 string which encodes 32 bytes, used to derive the per-channel encryption keys (see below!)
  })