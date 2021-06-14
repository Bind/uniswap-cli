import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2",
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/index-node/graphql",
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const v1Client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap",
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const stakingClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/way2rach/talisman",
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
});

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks",
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
});
