/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as chat_mutations from "../chat/mutations.js";
import type * as chat_queries from "../chat/queries.js";
import type * as chat_types from "../chat/types.js";
import type * as http from "../http.js";
import type * as presence from "../presence.js";
import type * as quiz_actions from "../quiz/actions.js";
import type * as quiz_errors from "../quiz/errors.js";
import type * as quiz_mutations from "../quiz/mutations.js";
import type * as quiz_prompts from "../quiz/prompts.js";
import type * as quiz_schemas from "../quiz/schemas.js";
import type * as quiz_types from "../quiz/types.js";
import type * as quiz_utils from "../quiz/utils.js";
import type * as rooms_errors from "../rooms/errors.js";
import type * as rooms_mutations from "../rooms/mutations.js";
import type * as rooms_queries from "../rooms/queries.js";
import type * as rooms_utils from "../rooms/utils.js";
import type * as users_errors from "../users/errors.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "chat/mutations": typeof chat_mutations;
  "chat/queries": typeof chat_queries;
  "chat/types": typeof chat_types;
  http: typeof http;
  presence: typeof presence;
  "quiz/actions": typeof quiz_actions;
  "quiz/errors": typeof quiz_errors;
  "quiz/mutations": typeof quiz_mutations;
  "quiz/prompts": typeof quiz_prompts;
  "quiz/schemas": typeof quiz_schemas;
  "quiz/types": typeof quiz_types;
  "quiz/utils": typeof quiz_utils;
  "rooms/errors": typeof rooms_errors;
  "rooms/mutations": typeof rooms_mutations;
  "rooms/queries": typeof rooms_queries;
  "rooms/utils": typeof rooms_utils;
  "users/errors": typeof users_errors;
  "users/queries": typeof users_queries;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  presence: {
    public: {
      disconnect: FunctionReference<
        "mutation",
        "internal",
        { sessionToken: string },
        null
      >;
      heartbeat: FunctionReference<
        "mutation",
        "internal",
        {
          interval?: number;
          roomId: string;
          sessionId: string;
          userId: string;
        },
        { roomToken: string; sessionToken: string }
      >;
      list: FunctionReference<
        "query",
        "internal",
        { limit?: number; roomToken: string },
        Array<{ lastDisconnected: number; online: boolean; userId: string }>
      >;
      listRoom: FunctionReference<
        "query",
        "internal",
        { limit?: number; onlineOnly?: boolean; roomId: string },
        Array<{ lastDisconnected: number; online: boolean; userId: string }>
      >;
      listUser: FunctionReference<
        "query",
        "internal",
        { limit?: number; onlineOnly?: boolean; userId: string },
        Array<{ lastDisconnected: number; online: boolean; roomId: string }>
      >;
      removeRoom: FunctionReference<
        "mutation",
        "internal",
        { roomId: string },
        null
      >;
      removeRoomUser: FunctionReference<
        "mutation",
        "internal",
        { roomId: string; userId: string },
        null
      >;
    };
  };
};
