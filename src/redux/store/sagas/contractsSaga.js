import { fork, put, takeLatest, call, all, select } from 'redux-saga/effects'
// import { delay } from 'redux-saga'
import AT from '../../actionTypes/actionTypes';
import {
  POPUP_TYPE
} from '../../../utils/const'
import {
  contractList as CONTRACT_LIST_API,
  contractInfo as CONTRACT_INFO_API,
  contractDetail as CONTRACT_DETAIL_API,
  contractTxList as CONTRACT_TX_LIST_API,
  contractInternalTxList as CONTRACT_INTERNAL_TX_LIST_API,
  contractTokenTxList as CONTRACT_TOKEN_TX_LIST_API,
  contractEventLogList as CONTRACT_EVENT_LOG_LIST_API,
  icxCall as ICX_CALL_API,
  // icxGetScore as ICX_GET_SCORE_API,
} from '../../api/restV3';
import {   getContractABI as ICX_GET_CONTRACT } from '../../api/restV3/iiss'
import { getScoreStatus } from '../../store/contracts';

export default function* contractsSaga() {
  yield fork(watchContractList);
  yield fork(watchContractListSearch);
  yield fork(watchContractInfo);
  yield fork(watchContractDetail);
  yield fork(watchContractDetailPopup);
  yield fork(watchContractTxList);
  yield fork(watchContractInternalTxList);
  yield fork(watchContractTokenTxList);
  yield fork(watchContractEventLogList);
  yield fork(watchIcxGetSrore);
  yield fork(watchIcxCall);
  yield fork(watchReadContractInformation);
}

function* watchContractList() { yield takeLatest(AT.contractList, contractListFunc) }
function* watchContractListSearch() { yield takeLatest(AT.contractListSearch, contractListSearchFunc) }
function* watchContractInfo() { yield takeLatest(AT.contractInfo, contractInfoFunc) }
function* watchContractDetail() { yield takeLatest(AT.contractDetail, contractDetailFunc) }
function* watchContractDetailPopup() { yield takeLatest(AT.contractDetailPopup, contractDetailPopupFunc) }
function* watchContractTxList() { yield takeLatest(AT.contractTxList, contractTxListFunc) }
function* watchContractInternalTxList() { yield takeLatest(AT.contractInternalTxList, contractInternalTxListFunc) }
function* watchContractTokenTxList() { yield takeLatest(AT.contractTokenTxList, contractTokenTxListFunc) }
function* watchContractEventLogList() { yield takeLatest(AT.contractEventLogList, contractEventLogListFunc) }
function* watchIcxGetSrore() { yield takeLatest(AT.icxGetScore, icxGetSroreFunc) }
function* watchIcxCall() { yield takeLatest(AT.icxCall, icxCallFunc) }
function* watchReadContractInformation() { yield takeLatest(AT.readContractInformation, readContractInformationFunc) }

export function* contractListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({ type: AT.contractListFulfilled, payload: { data: [] } });
      return
    }

    const payload = yield call(CONTRACT_LIST_API, action.payload);

    if (payload.status === 200) {
      yield put({ type: AT.contractListFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractListRejected });
  }
}

export function* contractListSearchFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({ type: AT.contractListSearchFulfilled, payload: { data: [] } });
      return
    }

    const payload = yield call(CONTRACT_LIST_API, action.payload);
    if (payload.status === 200 || 'NO Data') {
      yield put({ type: AT.contractListSearchFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractListSearchRejected });
  }
}

export function* contractInfoFunc(action) {
  try {
    console.log(action.payload, "cx saga payload info")
    const payload = yield call(CONTRACT_INFO_API, action.payload.addr);
    console.log(payload, "cx saga payload info res")
    if (payload.status === 200 && payload.data !== "NO_DATA") {
      console.log(action.payload, "the thing")

      // const  depositInfo  = yield call(getScoreStatus, action.payload.addr)
      // payload.data.depositInfo = depositInfo
        yield put({ type: AT.contractInfoFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    console.log(e, "hit an error")
    yield put({ type: AT.contractInfoRejected, error: action.payload.addr });
  }
}

export function* contractDetailFunc(action) {
  try {
    const payload = yield call(CONTRACT_DETAIL_API, action.payload);
    if (payload.status === 200 && payload.data !== "NO_DATA") {
      yield put({ type: AT.contractDetailFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractDetailRejected });
  }
}

export function* contractDetailPopupFunc(action) {
  try {
    const payload = yield call(CONTRACT_DETAIL_API, action.payload);
    if (payload.status === 200 && payload.data !== "NO_DATA") {
      payload.type = POPUP_TYPE.DETAIL
      yield put({ type: AT.setPopup, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    console.log(e)
  }
}

export function* contractTxListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({ type: AT.contractTxListFulfilled, payload: { data: [] } });
      return
    }

    const payload = yield call(CONTRACT_TX_LIST_API, action.payload);
    if (payload.status === 200) {
      yield put({ type: AT.contractTxListFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractTxListRejected });
  }
}

export function* contractInternalTxListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({ type: AT.contractInternalTxListFulfilled, payload: { data: [] } });
      return
    }

    const payload = yield call(CONTRACT_INTERNAL_TX_LIST_API, action.payload);
    if (payload.status === 200) {
      yield put({ type: AT.contractInternalTxListFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractInternalTxListRejected });
  }
}

export function* contractTokenTxListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({ type: AT.contractTokenTxListFulfilled, payload: { data: [] } });
      return
    }

    const payload = yield call(CONTRACT_TOKEN_TX_LIST_API, action.payload);
    if (payload.status === 200) {
      yield put({ type: AT.contractTokenTxListFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractTokenTxListRejected });
  }
}

export function* contractEventLogListFunc(action) {
  try {
    if (action.payload.count === 0) {
      yield put({ type: AT.contractEventLogListFulfilled, payload: { data: [] } });
      return
    }

    const payload = yield call(CONTRACT_EVENT_LOG_LIST_API, action.payload);
    if (payload.status === 200) {
      yield put({ type: AT.contractEventLogListFulfilled, payload });
    }
    else {
      throw new Error();
    }
  }
  catch (e) {
    yield put({ type: AT.contractEventLogListRejected });
  }
}

export function* icxGetSroreFunc(action) {
  try {
    const payload = yield call(ICX_GET_CONTRACT, action.payload);
    if (payload.length !== 0) {
      yield put({ type: AT.icxGetScoreFulfilled, payload: { data: payload } });
    }
    else {
      const { message } = payload.error
      throw new Error(message)
    }
  }
  catch (e) {
    yield put({ type: AT.icxGetScoreRejected, error: e.message });
  }
}

export function* icxCallFunc(action) {
  try {
    const { address, method, params } = action.payload
    const funcOutputs = yield select(state => state.contracts.contractReadInfo.funcOutputs);
    const outputs = yield call(ICX_CALL_API, {
      from: "hx23ada4a4b444acf8706a6f50bbc9149be1781e13",
      to: address,
      dataType: "call",
      data: {
        method,
        params
      }
    })

    const { index } = action.payload
    if (outputs.status === 200) {
      const { result } = outputs.data
      const valueArray = [result]
      funcOutputs[index] = {
        valueArray,
        error: ''
      }
    }
    else {
      const { message } = outputs.error
      funcOutputs[index] = {
        valueArray: [],
        error: message
      }
    }
    const payload = { funcOutputs }
    yield put({ type: AT.icxCallFulfilled, payload })
  }
  catch (e) {
    yield put({ type: AT.icxCallRejected });
  }
}

export function* readContractInformationFunc(action) {
  try {
    console.log(action.payload, "what is the score action payload")
    const score = yield call(ICX_GET_CONTRACT, action.payload.address);
    if (score.length === 0) {
      const { message } = score.error
      throw new Error(message)
    }
    console.log(score, "score is abi")
    const abiData = score
    const readOnlyFunc = (abiData || []).filter(func => func["type"] === "function" && func["readonly"] === "0x1")
    const { address } = action.payload
    const funcList = [...readOnlyFunc]
    const _funcOutputs = yield all(
      readOnlyFunc.map(
        func => {
          if (func["inputs"].length === 0) {
            return call(ICX_CALL_API, {
              from: "hx23ada4a4b444acf8706a6f50bbc9149be1781e13",
              to: address,
              dataType: "call",
              data: {
                method: func["name"]
              }
            })
          }
          else {
            return ''
          }
        }
      )
    )
    const funcOutputs = []
    _funcOutputs.forEach(output => {
      if (output === '') {
        funcOutputs.push({
          valueArray: [],
          error: ''
        })
      }
      else if (output.status === 200) {
        const { result } = output.data
        const valueArray = [result]
        funcOutputs.push({
          valueArray,
          error: ''
        })
      }
      else {
        const { message } = output.error
        funcOutputs.push({
          valueArray: [],
          error: message
        })
      }
    })
    const payload = { funcList, funcOutputs }
    yield put({ type: AT.readContractInformationFulfilled, payload })
  }
  catch (e) {
    yield put({ type: AT.readContractInformationRejected, error: e.message })
  }
}