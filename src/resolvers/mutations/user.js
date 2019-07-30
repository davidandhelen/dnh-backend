const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserMutations = {
  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.prisma.mutation.createUser({
      data: { ...args, password }
    });

    return {
      token: jwt.sign(
        {
          id: user.id,
        },
        'secret'
      ),
      user
    };
  },

  async login(parent, { email, password }, ctx, info) {
    const user = await ctx.prisma.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email: ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    return {
      token: jwt.sign(
        {
          id: user.id,
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
      throw new Error('Invalid password');
    }

    return ctx.prisma.mutation.deleteUser({ where }, info);
  },

  async updateUser(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10);
    const where = { id: args.id };

    //if patient doesn't exit, throw error
    if (!user) {
      throw new Error('Invalid password');
    }

    return ctx.db.mutation.updateUser(
      {
        where,
        data: {
          firstName: args.firstName,
          lastName: args.lastName,
          password,
          phone: args.phone,
          note: args.note ? args.note : '',
          rsvpStatus: args.rsvpStatus,
          addressLineOne: args.addressLineOne,
          addressLineTwo: args.addressLineTwo ? args.addressLineTwo : '',
          country: args.country,
          zipCode: args.zipCode,
          state: args.state,
          city: args.city
        }
      },
      info
    );
  }
};

module.exports = { UserMutations };
