const jwt = require('jsonwebtoken');

const Query = {
  user: async ({ user: { id } }, args, context, info) => {
    return context.prisma.query.user({ where: { id } }, info);
  },
  users: (_, args, context, info) => {
    return context.prisma.query.users({}, info);
  },
  me: async (_, args, context, info) => {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
      const token = Authorization.replace('Bearer ', '');
      const { userId } = jwt.verify(token, 'secret');
      const user = await context.prisma.query.user({ where: { id: userId } });

      return user;
    }

    throw new Error('Not authenticated');
  }
};

module.exports = { Query };
