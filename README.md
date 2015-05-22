NOTES

Data structure:

sockets:for:*
rooms:*:online
rooms:*:info => online => [online_users_count]
socketio:sockets
sockets:for:[userKey]:at:[room_id] => [socket.id]
socketio:sockets => [socket.id]
rooms:[room_id]:online => userKey
users:[userKey]:status' => 'available'|'away'


Boot:
- create a server
- clean the database (init.js)
- *when a user connects*
- retrieve session data for the user that's loggin in (sockets.js) - set the user.balloons property of the headers for retrieval later
- assign engine.io instance a RedisStore (sockets.js)
- has the user's socket join the socket room (which matches a chat room) identified from their handshake data
- emit to that room a message that the user has joined, passing in the new user's data
- subscribe socket to 'my msg' (any messages from that user in particular which are emitted on the client), sort of adds it to the log, then emits it to all sockets subscribed to that room
- subscribes to status change updates from that user (ditto from above)
- subscribes to chat history requests and handles them by emitting logs to the client
- subscribes to disconnection event by removing/decrementing database values as appropriate, and emitting a user leave event to the client



MEANINGFUL FIRST TASK

- map out MVP data structure
- create a MongoDB, connect on the client
- add a client button that adds a room to the DB and joins it
- delete the room if there are no connections to it (should probably in the socket disconnect handler)