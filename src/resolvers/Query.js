const jwt = require('jsonwebtoken');

const Query = {
  user: async ({ user: { id } }, args, ctx, info) => {
    return ctx.prisma.query.user({ where: { id } }, info);
  },
  // This query is probably going to be used for the admin page (for D / H only)
  users: (_, args, ctx, info) => {
    return ctx.prisma.query.users({}, info);
  },
  me: async (_, args, ctx, info) => {
    const Authorization = ctx.request.get('Authorization');
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '');
      const { id } = jwt.verify(token, 'secret');
      const user = await ctx.prisma.query.user({ where: { id } });

      return user;
    }

    throw new Error('Not authenticated');
  }
};

module.exports = { Query };
