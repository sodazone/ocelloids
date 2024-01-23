// Copyright 2023-2024 SO/DA zone
// SPDX-License-Identifier: Apache-2.0

import { MultiAddress, DispatchError } from '@polkadot/types/interfaces';
import type { Call } from '@polkadot/types/interfaces/runtime';
import type { Result, Null } from '@polkadot/types-codec';

import { TxWithIdAndEvent } from '../../types/interfaces.js';
import { callAsTxWithBoundary, getArgValueFromTx } from './util.js';
import { Flattener } from './flattener.js';

const ProxyExecuted = 'proxy.ProxyExecuted';
const ProxyExecutedBoundary = {
  eventName: ProxyExecuted
};

/**
 * Extracts proxy calls from a transaction.
 * Maps the execution result from 'ProxyExecuted' event to the extracted call and
 * adds the proxy address as an origin to the transaction.
 *
 * @param tx - The input transaction to extract proxy calls from .
 * @returns The extracted proxy call as TxWithIdAndEvent.
 */
export function extractProxyCalls(tx: TxWithIdAndEvent, flattener: Flattener) {
  const { extrinsic } = tx;
  const real = getArgValueFromTx(extrinsic, 'real') as MultiAddress;
  const call = getArgValueFromTx(extrinsic, 'call') as Call;

  const proxyExecutedIndex = flattener.findEventIndex(ProxyExecuted);
  const executedEvent = flattener.getEvent(proxyExecutedIndex);
  const [callResult] = executedEvent.data as unknown as [Result<Null, DispatchError>];

  return [callAsTxWithBoundary(
    {
      call,
      tx,
      boundary: ProxyExecutedBoundary,
      callError: callResult.isErr ? callResult.asErr : undefined,
      origin: { type: 'proxy', address: real }
    }
  )];
}