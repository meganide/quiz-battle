/* eslint-disable import/no-default-export */
import { httpRouter } from "convex/server"

import { auth } from "./auth"

const http = httpRouter()

auth.addHttpRoutes(http)

export default http
