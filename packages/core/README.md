# Ocelloids Core Module

<a href="https://www.npmjs.com/package/@sodazone/ocelloids">
  <img 
    src="https://img.shields.io/npm/v/@sodazone/ocelloids?color=69D2E7&labelColor=69D2E7&logo=npm&logoColor=333333"
    alt="npm @sodazone/ocelloids"
  />
</a>

The Ocelloids Core Module provides base abstractions, reactive operators, and pallet-independent functionality.

## Usage

Refer to the [SDK documentation](https://sodazone.github.io/ocelloids/).

Additionally, check out the [examples/](https://github.com/sodazone/ocelloids/tree/main/examples) folder for example applications.

## Logging

Ocelloids supports configuring debug logger outputs to aid in development.

The table below displays the available loggers and their descriptions:

| Logger Name | Description |
| ----------- | ----------- |
| oc-ops-mongo-filter | Outputs the transformed object data in "named primitive" format before filtering in the `mongo-filter` operator. |
| oc-blocks | Outputs the current block number in block-related observables. |
| oc-substrate-apis | Outputs the initialisation data of the Substrate APIs. |

To enable debugging logs for a specific category, use the `DEBUG` environment variable with the corresponding logger name.

For example, to enable debugging logs for the "oc-ops-mongo-filter" category, you can run the following command:

```shell
DEBUG=oc-ops-mongo-filter yarn filter-fee-events
```

You can specify multiple logger names separated by a comma, as shown in the example below:

```shell
DEBUG=oc-ops-mongo-filter,oc-blocks yarn filter-fee-events
```

These loggers provide valuable information that can assist with data filtering and tracking contextual information.

## Custom Methods and Types

When instantiating the APIs, you have the flexibility to register custom RPC and runtime methods, as well as define custom types for the networks you're interacting with.

Here's a simple demonstration:

```typescript
import { WsProvider } from '@polkadot/api';

import { SubstrateApis } from '@sodazone/ocelloids';

const apis = new SubstrateApis({
  network: {
    provider: new WsProvider('wss://my-custom-rpc.io'),
    rpc: {
      // custom RPC methods
    },
    runtime: {
      // custome runtime methods
    },
    types: [
      {
        "minmax": [
          0,
          null
        ],
        types: {
          // custom types
        }
      }
    ]
  },
});
```

For more detailed information on extending types and methods in the API, please refer to the Polkadot.js documentation on [Extending Types](https://polkadot.js.org/docs/api/start/types.extend) and [Custom RPC](https://polkadot.js.org/docs/api/start/rpc.custom).

You can also explore a practical example of how custom methods and types are registered in the [watch-contracts](https://github.com/sodazone/ocelloids/tree/main/examples/watch-contracts) example application.

## Layout

The `packages/core` module source folder is structured as follows:

| Directory                    | Description                               |
|------------------------------|-------------------------------------------|
|  apis                        | Multi-chain APIs                          |
|  configuration               | Configuration                             |
|  converters                  | Chain data type conversions               |
|  observables                 | Reactive emitters                         |
|  operators                   | Reactive operators                        |
|  subjects                    | Reactive subjects                         |
|  types                       | Extended types                            |

