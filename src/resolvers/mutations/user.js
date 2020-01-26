const jwt = require("jsonwebtoken");

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
        "secret"
      ),
      user
    };
  },

  async login(parent, { phone }, ctx, info) {
    const user = await ctx.prisma.query.user({ where: { phone } });
    if (!iser) {
      throw new Error("User not found");
    }

    return {
      token: jwt.sign(
        {
          id: user.id
        },
        "secret",
        {
          algorithm: "HS256"
        }
      ),
      user
    };
  },

  async deleteUser(parent, args, ctx, info) {
    const where = { id: args.id };
    const user = await ctx.prisma.query.user({ where }, `{ id }`);
    if (!user) {
      throw new Error("Invalid phone");
    }

    return ctx.prisma.mutation.deleteUser({ where }, info);
  },

  async updateUser(parent, args, ctx, info) {
    const where = { id: args.id };

    //if patient doesn't exit, throw error
    if (!user) {
      throw new Error("Invalid phone");
    }

    return ctx.db.mutation.updateUser(
      {
        where,
        data: {
          firstName: args.firstName,
          lastName: args.lastName,
          rsvpStatus: args.rsvpStatus,
          phone: args.phone,
          guestType: 'invitee',
          note: args.note ? args.note : "",
          allowedPlusOnes: args.allowedPlusOnes ? args.allowedPlusOnes : null
        }
      },
      info
    );
  }
};

module.exports = { UserMutations };
