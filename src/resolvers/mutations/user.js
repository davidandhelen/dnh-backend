const jwt = require('jsonwebtoken');

const UserMutations = {
  async createUser(parent, args, ctx, info) {
    const user = await ctx.prisma.mutation.createUser({
      data: { ...args }
    });

    return {
      token: jwt.sign(
        {
          id: user.id
        },
        'secret'
      ),
      user
    };
  },

  async login(parent, { phone }, ctx, info) {
    const user = await ctx.prisma.query.user({ where: { phone } });
    if (!user) {
      throw new Error('User not found');
    }

    return {
      token: jwt.sign(
        {
          id: user.id
        },
        'secret',
        {
          algorithm: 'HS256'
        }
      ),
      user
    };
  },

  async deleteUser(parent, args, ctx, info) {
    const where = { id: args.id };
    const user = await ctx.prisma.query.user({ where }, `{ id }`);
    if (!user) {
      throw new Error('User not found');
    }

    return ctx.prisma.mutation.deleteUser({ where }, info);
  },

  async updateUser(parent, args, ctx, info) {
    const where = { id: args.id };
    const user = await ctx.prisma.query.user(
      { where },
      `{ id firstName lastName rsvpStatus phone guestType note allowedPlusOnes }`
    );
    if (!user) {
      throw new Error('User not found');
    }

    return ctx.prisma.mutation.updateUser(
      {
        where,
        data: {
          firstName: args.firstName ? args.firstName : user.firstName,
          lastName: args.lastName ? args.lastName : user.lastName,
          rsvpStatus: args.rsvpStatus ? args.rsvpStatus : user.rsvpStatus,
          phone: args.phone ? args.phone : user.phone,
          guestType: args.guestType ? args.guestType : user.guestType,
          note: args.note ? args.note : user.note,
          allowedPlusOnes: args.allowedPlusOnes
            ? args.allowedPlusOnes
            : user.allowedPlusOnes
        }
      },
      info
    );
  }
};

module.exports = { UserMutations };
