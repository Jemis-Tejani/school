import qs from "qs";

class Query {
  static getStudentsQuery = ({ email }) => {
    return qs.stringify({
      filters: {
        users_permissions_user: {
          email: {
            $eq: email,
          },
        },
      },
      populate: {
        division: {
          fields: ["division_name"],
        },
        subject: {
          fields: ["subject_name"],
        },
        standard: {
          fields: ["standard_name"],
        },
      },
    });
  };
}

export default Query;
