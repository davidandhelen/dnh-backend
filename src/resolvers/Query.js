const jwt = require('jsonwebtoken');

const Query = {
  user: async ({ user: { id } }, args, ctx, info) => {
    return ctx.prisma.query.user({ where: { id } }, info);
  },
  users: (_, args, ctx, info) => {
    return ctx.prisma.query.users({}, info);
  },
  me: async (_, args, ctx, info) => {
    const Authorization = ctx.request.get('Authorization');
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '');
      const { userId } = jwt.verify(token, 'secret');
      const user = await ctx.prisma.query.user({ where: { id: userId } });

      return user;
    }

    throw new Error('Not authenticated');
  }
};

module.exports = { Query };
