import {fork, put, takeLatest, call} from 'redux-saga/effects'
import AT from '../../actionTypes/actionTypes';

import {
  addressReward as ADDRESS_REWARD,
  getDelegation,
} from '../../api/restV3';

import {
  addressList as ADDRESS_LIST_API,
  addressInfo as ADDRESS_INFO_API,
  addressTxList as ADDRESS_TX_LIST,
  addressInternalTxList as ADDRESS_INTERNAL_TX_LIST,
  addressTokenTxList as ADDRESS_TOKEN_TX_LIST,
  addressVotedList as ADDRESS_VOTED_LIST,
} from '../addresses'

import {
  getDelegationPrep,
  prepList,
  getStake,
  queryIScore,
  getBalance,
  getDelegation as ADDRESS_DELEGATION_LIST
} from '../../store/iiss';
import {convertLoopToIcxDecimal} from '../../../utils/utils';

export default function* addressesSaga() {
  yield fork(watchAddressRewardList);
  yield fork(watchAddressDelegationList);
  yield fork(watchAddressVotedList);
  yield fork(watchAddressList);
  yield fork(watchAddressInfo);
  yield fork(watchAddressTxList);
  yield fork(watchAddressInternalTxList);
  yield fork(watchAddressTokenTxList);
}

function* watchAddressRewardList() {
  yield takeLatest(AT.addressRewardList, addressRewardListFunc)
}

function* watchAddressDelegationList() {
  yield takeLatest(AT.addressDelegationList, addressDelegationListFunc)
}

function* watchAddressVotedList() {
  yield takeLatest(AT.addressVotedList, addressVotedListFunc)
}

function* watchAddressList() {
  yield takeLatest(AT.addressList, addressListFunc)
}

function* watchAddressInfo() {
  yield takeLatest(AT.addressInfo, addressInfoFunc)
}

function* watchAddressTxList() {
  yield takeLatest(AT.addressTxList, addressTxListFunc)
}

function* watchAddressInternalTxList() {
  yield takeLatest(AT.addressInternalTxList, addressInternalTxListFunc)
}

function* watchAddressTokenTxList() {
  yield takeLatest(AT.addressTokenTxList, addressTokenTxListFunc)
}

export function* addressRewardListFunc(action) {
  try {
    const payload = yield call(ADDRESS_REWARD, action.payload);
    if (payload.status === 200) {
      yield put({type: AT.addressRewardListFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    yield put({type: AT.addressRewardListRejected});
  }
}

export function* addressDelegationListFunc(action) {
  try {
    const {address} = action.payload
    const payload = yield call(ADDRESS_DELEGATION_LIST, address);
    const {delegations} = payload
    if (delegations) {
      const res = yield call(prepList)
      const data = delegations.map(prep => {
        const {address, value} = prep
        const index = res.findIndex(p => p.address === address)
        let searched = {address}
        if (index !== -1) {
          searched = res[index]
        }
        searched.value = value
        return searched
      })
      yield put({
        type: AT.addressDelegationListFulfilled, payload: {
          data,
          listSize: data.length,
          totalSize: data.length
        }
      });
    } else {
      throw new Error()
    }
  } catch (e) {
    console.log(e, "saga error")
    yield put({type: AT.addressDelegationListRejected});
  }
}

export function* addressVotedListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({type: AT.addressVotedListFulfilled, payload: {data: []}});
      return
    }
    const payload = yield call(ADDRESS_VOTED_LIST, action.payload);
    if (payload.status === 200) {
      yield put({type: AT.addressVotedListFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    yield put({type: AT.addressVotedListRejected});
  }

}

export function* addressListFunc(action) {

  try {
    if (action.payload.count === 0) {
      yield put({type: AT.addressListFulfilled, payload: {data: []}});
      return
    }

    const payload = yield call(ADDRESS_LIST_API, action.payload);

    if (payload.length !== 0) {
      yield put({type: AT.addressListFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    yield put({type: AT.addressListRejected});
  }
}

export function* addressInfoFunc(action) {
  try {
    const payload = yield call(ADDRESS_INFO_API, action.payload);
    if (payload.status === 200) {
      const {address} = action.payload
      const balance = yield call(getBalance, address)
      const {iscore} = yield call(queryIScore, address)
      const _balance = !balance ? 0 : convertLoopToIcxDecimal(balance)
      const _iscore = !iscore ? 0 : convertLoopToIcxDecimal(iscore)
      const isPrep = payload.data.is_prep
      let active = 'Inactive';
      let media = {}

      if (isPrep) {
        try {

          const {stake, unstakes} = yield call(getStake, address)
          const _stake = !stake ? 0 : convertLoopToIcxDecimal(stake)
          const prep = yield call(getDelegationPrep, address)
          const {delegated} = yield call(getDelegation, address)
          active = payload.data && payload.data.status <= 2 ? 'Active' : 'Inactive'
          payload.data = {
            ...payload.data,
            hasDelegations: delegated,
            isPrep,
            available: _balance,
            staked: _stake,
            unstakes,
            iscore: _iscore,
            delegated,
            prep: prep.data[0],
            active,
            media,
          }
          yield put({type: AT.addressInfoFulfilled, payload: payload});
        } catch (e) {
          console.log(e, "address saga error")
        }
      }

      payload.data = {
        ...payload.data,
        hasDelegations: false,
        isPrep,
        available: _balance,
        iscore: _iscore,
        active,
        media,
      }


      yield put({type: AT.addressInfoFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    console.log(e, "error")
    yield put({type: AT.addressInfoRejected, error: action.payload.address});
  }
}

export function* addressTxListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({type: AT.addressTxListFulfilled, payload: {data: []}});
      return
    }
    const payload = yield call(ADDRESS_TX_LIST, action.payload);

    if (payload.status === 200) {
      yield put({type: AT.addressTxListFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    yield put({type: AT.addressTxListRejected});
  }
}

export function* addressInternalTxListFunc(action) {

  try {
    if (action.payload.count === 0) {
      yield put({type: AT.addressInternalTxListFulfilled, payload: {data: []}});
      return
    }

    const payload = yield call(ADDRESS_INTERNAL_TX_LIST, action.payload);
    if (payload.status === 200) {
      yield put({type: AT.addressInternalTxListFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    yield put({type: AT.addressInternalTxListRejected});
  }
}

export function* addressTokenTxListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({type: AT.addressTokenTxListFulfilled, payload: {data: []}});
      return
    }

    const payload = yield call(ADDRESS_TOKEN_TX_LIST, action.payload);
    if (payload.status === 200) {
      yield put({type: AT.addressTokenTxListFulfilled, payload: payload});
    } else {
      throw new Error();
    }
  } catch (e) {
    yield put({type: AT.addressTokenTxListRejected});
  }
}

