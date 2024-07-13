import omit from 'lodash';

const action = 'request-profile';

export default {
  action,
  claims: {
    profile: () => ({
      description: 'Please provide your full profile',
      fields: ['fullName', 'email', 'phone', 'signature', 'avatar', 'birthday'],
    }),
  },

  onAuth: ({ userDid, userPk, claims, updateSession }: any) => {
    const claim = claims.find((x) => x.type === 'profile');
    updateSession({
      result: {
        ...omit(claim, ['type', 'signature']),
        did: userDid,
        pk: userPk,
      },
    });
  },
};
