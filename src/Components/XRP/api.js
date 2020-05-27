export const requestV2 = async (queryMsg) => {
  try {
    const encodedQuery = encodeURIComponent(queryMsg);
    const url = `https://route.cbx.io/api/v2/rippleELBGetApi?query=${encodedQuery}`;
    // `http://34.209.188.67:4545/graphql?query=${encodedQuery}`;
    //https://route.cbx.io/api/v2/rippleELBGetApi?query=
    // `http://ec2-52-15-66-195.us-east-2.compute.amazonaws.com:4545/graphql?query=${encodedQuery}`;

    const options = {
      method: "GET",
      headers: {
        authKey: "d579bf4a2883cecf610785c49623ff",
      },
    };

    const response = await fetch(url, options);
    if (response.status !== "200") {
      throw "Ripple API in maintainance";
    }
    const bodyText = await response.json();
    // check data with error keys
    let { error, errors } = bodyText;

    if (error) {
      throw error;
    }
    if (errors) {
      throw errors[0].message;
    }

    return bodyText.data;
  } catch (error) {
    console.log(`requestV2: ${error}`);
  }
};
