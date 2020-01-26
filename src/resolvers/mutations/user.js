const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserMutations = {
  async signup(parent, args, ctx, info) {
    const phone = await bcrypt.hash(args.phone, 10);
    const user = await ctx.prisma.mutation.createUser({
      data: { ...args, phone }
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
    if (!user) {
      throw new Error(`No such user found for email: ${email}`);
    }

    const valid = await bcrypt.compare(phone, user.phone);
    if (!valid) {
      throw new Error("Invalid phone");
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
    const phone = await bcrypt.hash(args.phone, 10);
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
          phone,
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
