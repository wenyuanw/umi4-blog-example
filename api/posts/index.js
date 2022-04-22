var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.matchApiRoute = exports.esbuildIgnorePathPrefixPlugin = void 0;
    function esbuildIgnorePathPrefixPlugin() {
      return {
        name: "ignore-path-prefix",
        setup(build) {
          build.onResolve({ filter: /^@fs/ }, (args) => ({
            path: args.path.replace(/^@fs/, "")
          }));
        }
      };
    }
    exports.esbuildIgnorePathPrefixPlugin = esbuildIgnorePathPrefixPlugin;
    function matchApiRoute(apiRoutes2, path) {
      if (path.startsWith("/"))
        path = path.substring(1);
      if (path.startsWith("api/"))
        path = path.substring(4);
      const pathSegments = path.split("/").filter((p) => p !== "");
      if (pathSegments.length === 0 || pathSegments.length === 1 && pathSegments[0] === "api") {
        const route2 = apiRoutes2.find((r) => r.path === "/");
        if (route2)
          return { route: route2, params: {} };
        else
          return void 0;
      }
      const params = {};
      const route = apiRoutes2.find((route2) => {
        const routePathSegments = route2.path.split("/").filter((p) => p !== "");
        if (routePathSegments.length !== pathSegments.length)
          return false;
        for (let i = 0; i < routePathSegments.length; i++) {
          const routePathSegment = routePathSegments[i];
          if (routePathSegment.match(/^\[.*]$/)) {
            params[routePathSegment.substring(1, routePathSegment.length - 1)] = pathSegments[i];
            if (i == routePathSegments.length - 1)
              return true;
            continue;
          }
          if (routePathSegment !== pathSegments[i])
            return false;
          if (i == routePathSegments.length - 1)
            return true;
        }
      });
      if (route)
        return { route, params };
    }
    exports.matchApiRoute = matchApiRoute;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js
var require_request = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require_utils();
    var UmiApiRequest2 = class {
      constructor(req, apiRoutes2) {
        this._params = {};
        this._body = null;
        this._req = req;
        const m = (0, utils_1.matchApiRoute)(apiRoutes2, this.pathName || "");
        if (m)
          this._params = m.params;
      }
      get params() {
        return this._params;
      }
      get body() {
        return this._body;
      }
      get headers() {
        return this._req.headers;
      }
      get method() {
        return this._req.method;
      }
      get query() {
        var _a, _b;
        return ((_b = (_a = this._req.url) === null || _a === void 0 ? void 0 : _a.split("?")[1]) === null || _b === void 0 ? void 0 : _b.split("&").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          const k = acc[key];
          if (k) {
            if (k instanceof Array) {
              k.push(value);
            } else {
              acc[key] = [k, value];
            }
          } else {
            acc[key] = value;
          }
          return acc;
        }, {})) || {};
      }
      get cookies() {
        var _a;
        return (_a = this._req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split(";").reduce((acc, cur) => {
          const [key, value] = cur.split("=");
          acc[key.trim()] = value;
          return acc;
        }, {});
      }
      get url() {
        return this._req.url;
      }
      get pathName() {
        var _a;
        return (_a = this._req.url) === null || _a === void 0 ? void 0 : _a.split("?")[0];
      }
      readBody() {
        if (this._req.headers["content-length"] === "0") {
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          let body = "";
          this._req.on("data", (chunk) => {
            body += chunk;
          });
          this._req.on("end", () => {
            switch (this._req.headers["content-type"]) {
              case "application/json":
                try {
                  this._body = JSON.parse(body);
                } catch (e) {
                  this._body = body;
                }
                break;
              default:
                this._body = body;
                break;
            }
            resolve();
          });
          this._req.on("error", reject);
        });
      }
    };
    exports.default = UmiApiRequest2;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js
var require_response = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UmiApiResponse2 = class {
      constructor(res) {
        this._res = res;
      }
      status(statusCode) {
        this._res.statusCode = statusCode;
        return this;
      }
      header(key, value) {
        this._res.setHeader(key, value);
        return this;
      }
      setCookie(key, value) {
        this._res.setHeader("Set-Cookie", `${key}=${value}; path=/`);
        return this;
      }
      text(data) {
        this._res.setHeader("Content-Type", "text/plain; charset=utf-8");
        this._res.end(data);
        return this;
      }
      html(data) {
        this._res.setHeader("Content-Type", "text/html; charset=utf-8");
        this._res.end(data);
        return this;
      }
      json(data) {
        this._res.setHeader("Content-Type", "application/json");
        this._res.end(JSON.stringify(data));
        return this;
      }
    };
    exports.default = UmiApiResponse2;
  }
});

// node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js
var require_apiRoute = __commonJS({
  "node_modules/.pnpm/@umijs+preset-umi@4.0.0-rc.13/node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.matchApiRoute = exports.UmiApiResponse = exports.UmiApiRequest = void 0;
    var request_1 = require_request();
    Object.defineProperty(exports, "UmiApiRequest", { enumerable: true, get: function() {
      return __importDefault(request_1).default;
    } });
    var response_1 = require_response();
    Object.defineProperty(exports, "UmiApiResponse", { enumerable: true, get: function() {
      return __importDefault(response_1).default;
    } });
    var utils_1 = require_utils();
    Object.defineProperty(exports, "matchApiRoute", { enumerable: true, get: function() {
      return utils_1.matchApiRoute;
    } });
  }
});

// src/.umi-production/api/posts/index.ts
var posts_exports = {};
__export(posts_exports, {
  default: () => posts_default2
});
module.exports = __toCommonJS(posts_exports);

// src/.umi-production/api/_middlewares.ts
var middlewares_default = async (req, res, next) => {
  next();
};

// src/api/posts/index.ts
var import_client = require("@prisma/client");

// utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var secret = process.env.JWT_SECRET;
function verifyToken(token) {
  if (!secret)
    throw new Error("Environment variable JWT_SECRET is not defined!");
  return new Promise((resolve, reject) => {
    import_jsonwebtoken.default.verify(token, secret, (err, payload) => {
      if (err || !payload || !payload)
        return reject(err);
      resolve(payload);
    });
  });
}

// src/api/posts/index.ts
async function posts_default(req, res) {
  let prisma;
  switch (req.method) {
    case "GET":
      prisma = new import_client.PrismaClient();
      const allPosts = await prisma.post.findMany({ include: { author: true } });
      console.log(allPosts);
      res.status(200).json(allPosts);
      await prisma.$disconnect();
      break;
    case "POST":
      if (!req.cookies?.token) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }
      const authorId = (await verifyToken(req.cookies.token)).id;
      prisma = new import_client.PrismaClient();
      const newPost = await prisma.post.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          createdAt: new Date(),
          authorId,
          tags: req.body.tags.join(","),
          imageUrl: req.body.imageUrl
        }
      });
      res.status(200).json(newPost);
      await prisma.$disconnect();
      break;
    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}

// src/.umi-production/api/posts/index.ts
var import_apiRoute = __toESM(require_apiRoute());
var apiRoutes = [{ "path": "posts/[postId]", "id": "posts/[postId]", "file": "posts/[postId].ts", "absPath": "/posts/[postId]", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
import { PrismaClient } from '@prisma/client';\r
// import { Redis } from "@upstash/redis";\r
\r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  let prisma: PrismaClient;\r
  switch (req.method) {\r
    case 'GET':\r
      // const redis = Redis.fromEnv();\r
      let post = null\r
      if (post) {\r
        res.status(200).json(post);\r
        return;\r
      }\r
      if (!post) {\r
        prisma = new PrismaClient();\r
        post = await prisma.post.findUnique({\r
          where: { id: +req.params.postId },\r
          include: { author: true }\r
        });\r
        if (post) {\r
          res.status(200).json(post);\r
        } else {\r
          res.status(404).json({ error: 'Post not found.' });\r
        }\r
        // await redis.set('post-' + req.params.postId, JSON.stringify(post));\r
        await prisma.$disconnect();\r
      }\r
      break;\r
    default:\r
      res.status(405).json({ error: 'Method not allowed' })\r
  }\r
}\r
` }, { "path": "users/[userId]", "id": "users/[userId]", "file": "users/[userId].ts", "absPath": "/users/[userId]", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
import { PrismaClient } from '@prisma/client'\r
\r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  switch (req.method) {\r
    case 'GET':\r
      const prisma = new PrismaClient();\r
      const user = await prisma.user.findUnique({ where: { id: +req.params.userId } });\r
      res.status(200).json(user);\r
      await prisma.$disconnect()\r
      break;\r
    default:\r
      res.status(405).json({ error: 'Method not allowed' })\r
  }\r
}` }, { "path": "posts", "id": "posts/index", "file": "posts/index.ts", "absPath": "/posts", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
import { PrismaClient } from '@prisma/client'\r
import { verifyToken } from "@/utils/jwt";\r
\r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  let prisma: PrismaClient;\r
  switch (req.method) {\r
    case 'GET':\r
      prisma = new PrismaClient();\r
      const allPosts = await prisma.post.findMany({ include: { author: true } });\r
      console.log(allPosts);\r
      res.status(200).json(allPosts);\r
      await prisma.$disconnect()\r
      break;\r
\r
    case 'POST':\r
      if (!req.cookies?.token) {\r
        return res.status(401).json({\r
          message: 'Unauthorized'\r
        })\r
      }\r
      const authorId = (await verifyToken(req.cookies.token)).id;\r
      prisma = new PrismaClient();\r
      const newPost = await prisma.post.create({\r
        data: {\r
          title: req.body.title,\r
          content: req.body.content,\r
          createdAt: new Date(),\r
          authorId,\r
          tags: req.body.tags.join(','),\r
          imageUrl: req.body.imageUrl\r
        }\r
      })\r
      res.status(200).json(newPost);\r
      await prisma.$disconnect()\r
      break;\r
    default:\r
      res.status(405).json({ error: 'Method not allowed' })\r
  }\r
}\r
` }, { "path": "users", "id": "users/index", "file": "users/index.ts", "absPath": "/users", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
import { PrismaClient } from '@prisma/client'\r
\r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  switch (req.method) {\r
    case 'GET':\r
      const prisma = new PrismaClient();\r
      const allUsers = await prisma.user.findMany({\r
        select: {\r
          id: true,\r
          name: true,\r
          email: true,\r
          avatarUrl: true,\r
          passwordHash: false\r
        }\r
      });\r
      res.status(200).json(allUsers);\r
      await prisma.$disconnect()\r
      break;\r
    default:\r
      res.status(405).json({ error: 'Method not allowed' })\r
  }\r
}` }, { "path": "register", "id": "register", "file": "register.ts", "absPath": "/register", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
import { PrismaClient } from '@prisma/client'\r
import bcrypt from 'bcryptjs'\r
import { signToken } from "@/utils/jwt";\r
 \r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  switch (req.method) {\r
 \r
    // \u5982\u679C\u5BF9\u8FD9\u4E2A\u8DEF\u5F84\u53D1\u8D77 POST \u8BF7\u6C42\uFF0C\u4EE3\u8868\u4ED6\u60F3\u8981\u6CE8\u518C\u4E00\u4E2A\u8D26\u53F7\r
    case 'POST':\r
      try {\r
 \r
        // \u5EFA\u7ACB\u4E00\u4E2A Prisma \u5BA2\u6237\u7AEF\uFF0C\u4ED6\u53EF\u4EE5\u5E2E\u52A9\u6211\u4EEC\u8FDE\u7EBF\u5230\u6570\u636E\u5E93\r
        const prisma = new PrismaClient();\r
 \r
        // \u5728\u6570\u636E\u5E93\u7684 User \u8868\u4E2D\u5EFA\u7ACB\u4E00\u4E2A\u65B0\u7684\u6570\u636E\r
        // const user = await prisma.user.create({\r
        //   data: {\r
        //     email: req.body.email,\r
 \r
        //     // \u5BC6\u7801\u662F\u7ECF\u8FC7 bcrypt \u52A0\u5BC6\u7684\r
        //     passwordHash: bcrypt.hashSync(req.body.password, 8),\r
        //     name: req.body.name,\r
        //     avatarUrl: req.body.avatarUrl\r
        //   }\r
        // });\r
        const user = await prisma.user.create({\r
          data: {\r
            email: 'wwenyuan@163.com',\r
 \r
            // \u5BC6\u7801\u662F\u7ECF\u8FC7 bcrypt \u52A0\u5BC6\u7684\r
            passwordHash: bcrypt.hashSync('12345678', 8),\r
            name: '\u6587\u5458',\r
            avatarUrl: 'https://p9-passport.byteacctimg.com/img/user-avatar/b661fc2588e3187e0357844ca82178a1~300x300.image'\r
          }\r
        });\r
 \r
        // \u628A\u5EFA\u7ACB\u6210\u529F\u7684\u7528\u6237\u6570\u636E\uFF08\u4E0D\u5305\u542B\u5BC6\u7801\uFF09\u548C JWT \u56DE\u4F20\u7ED9\u524D\u7AEF\r
        res.status(201)\r
          .setCookie('token', await signToken(user.id))\r
          .json({ ...user, passwordHash: undefined })\r
 \r
        // \u5904\u7406\u5B8C\u8BF7\u6C42\u4EE5\u540E\u8BB0\u5F97\u65AD\u5F00\u6570\u636E\u5E93\u94FE\u63A5 \r
        await prisma.$disconnect();\r
 \r
      } catch (e: any) {\r
 \r
        // \u5982\u679C\u53D1\u751F\u672A\u9884\u671F\u7684\u9519\u8BEF\uFF0C\u5C06\u5BF9\u5E94\u7684\u9519\u8BEF\u8BF4\u660E\u7684 Prisma \u6587\u6863\u53D1\u7ED9\u7528\u6237\r
        res.status(500).json({\r
          result: false,\r
          message: typeof e.code === 'string' ? 'https://www.prisma.io/docs/reference/api-reference/error-reference#' + e.code.toLowerCase() : e\r
        })\r
      }\r
      break;\r
    default:\r
      // \u5982\u679C\u4E0D\u662F POST \u8BF7\u6C42\uFF0C\u4EE3\u8868\u4ED6\u6B63\u5728\u7528\u9519\u8BEF\u7684\u65B9\u5F0F\u8BBF\u95EE\u8FD9\u4E2A API\r
      res.status(405).json({ error: 'Method not allowed' })\r
  }\r
}` }, { "path": "/", "id": "index", "file": "index.ts", "absPath": "/", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
\r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  res.status(200).json({\r
    posts_url: req.headers.host + '/api/posts',\r
    post_url: req.headers.host + "/api/posts/{post_id}",\r
    users_url: req.headers.host + '/api/users',\r
    user_url: req.headers.host + "/api/users/{user_id}",\r
  })\r
}` }, { "path": "login", "id": "login", "file": "login.ts", "absPath": "/login", "__content": `import { UmiApiRequest, UmiApiResponse } from "umi";\r
import { PrismaClient } from '@prisma/client'\r
import bcrypt from "bcryptjs";\r
import { signToken } from "@/utils/jwt";\r
\r
export default async function (req: UmiApiRequest, res: UmiApiResponse) {\r
  switch (req.method) {\r
    case 'POST':\r
      try {\r
        const prisma = new PrismaClient();\r
        const user = await prisma.user.findUnique({\r
          where: { email: req.body.email }\r
        });\r
        if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {\r
          return res.status(401).json({\r
            message: 'Invalid email or password'\r
          });\r
        }\r
        res.status(200)\r
          .setCookie('token', await signToken(user.id))\r
          .json({ ...user, passwordHash: undefined });\r
        await prisma.$disconnect()\r
      } catch (error: any) {\r
        res.status(500).json(error);\r
      }\r
      break;\r
    default:\r
      res.status(405).json({ error: 'Method not allowed' })\r
  }\r
}` }];
var posts_default2 = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await posts_default(umiReq, umiRes);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
