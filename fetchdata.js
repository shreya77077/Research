/// Updates the protocol.paused variable to the latest
/// known value in a loop by fetching it using The Graph.
async function updateProtocolPaused() {
  // It's ok to start with minBlock at 0. The query will be served
  // using the latest block available. Setting minBlock to 0 is the
  // same as leaving out that argument.
  let minBlock = 0;

  for (;;) {
    // Schedule a promise that will be ready once
    // the next Ethereum block will likely be available.
    const nextBlock = new Promise((f) => {
      setTimeout(f, 14000);
    });

    const query = `
        query GetProtocol($minBlock: Int!) {
            protocol(block: { number_gte: $minBlock }  id: "0") {
              paused
            }
            _meta {
                block {
                    number
                }
            }
        }`;

    const variables = { minBlock };
    const response = await graphql(query, variables);
    minBlock = response._meta.block.number;

    // TODO: Do something with the response data here instead of logging it.
    console.log(response.protocol.paused);

    // Sleep to wait for the next block
    await nextBlock;
  }
}
