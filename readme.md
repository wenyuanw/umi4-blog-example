# Umi4 博客

使用 Umi.js 搭配 PlanetScale , Prisma 和 Tailwindcss 等服务与技术，开发一个简单的博客网站，并部署到 Vercel 服务。


官网教程：https://next.umijs.org/docs/tutorials/blog
官方仓库：https://github.com/umijs/umi-blog-example

注意事项：
- 新建的 PlanetScale  数据库，推荐直接使用 `prisma db push` 而不用 `prisma migrate dev`
- 开发过程中，`.env`文件中需要设置两个环境变量，`DATABASE_URL`跟`JWT_SECRET`
- 最后使用 Vercel 部署的过程中，build 过程总是失败，咨询开发人员得知道原因是因为 pnpm 管理依赖的方式不太一样，然后 Vercel 不适配这个形式，因此需要在`.npmrc`文件中设置`node-linker=hoisted`