import { Server } from 'socket.io';
declare const app: import("express-serve-static-core").Express;
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export type App = typeof app;
export type Socket = typeof io;
export {};
//# sourceMappingURL=server.d.ts.map