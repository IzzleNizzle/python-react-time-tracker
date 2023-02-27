exports.handler = async (event) => {
    console.log("Hello, world!");

    const response = {
        statusCode: 200,
        body: JSON.stringify("Hello, world!"),
    };

    return response;
};
