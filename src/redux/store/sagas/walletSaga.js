import { fork, put, takeLatest } from "redux-saga/effects";
import AT from "../../actionTypes/actionTypes";

function* setAddress(action) {
  try {
    const { payload } = action;
    if (payload) {
      yield put({ type: AT.setAddressSuccess, payload });
    }
  } catch (e) {
    console.log(e);
  }
}

function* setNotification(action) {
  try {
    const { payload } = action;
    yield put({ type: AT.setNotificationSuccess, payload });
  } catch (e) {
    console.log(e);
  }
}

function* clearWallet() {
  try {
    yield put({ type: AT.clearWalletSuccess });
  } catch (e) {
    console.log(e);
  }
}

function* setWalletType(action) {
  try {
    const { payload } = action;
    if (payload) {
      yield put({ type: AT.setWalletTypeSuccess, payload });
    }
  } catch (e) {
    console.log(e);
  }
}

function* setBip44Path(action) {
  try {
    const { payload } = action;
    if (payload) {
      yield put({ type: AT.setBip44PathSuccess, payload });
    }
  } catch (e) {
    console.log(e);
  }
}
function* watchSetAddress() {
  yield takeLatest(AT.setAddress, setAddress);
}

function* watchSetNotification() {
  yield takeLatest(AT.setNotification, setNotification);
}

function* watchClearWallet() {
  yield takeLatest(AT.clearWallet, clearWallet);
}

function* watchWalletType() {
  yield takeLatest(AT.setWalletType, setWalletType);
}

function* watchBip44Path() {
  yield takeLatest(AT.setBip44Path, setBip44Path);
}

export default function* walletSaga() {
  yield fork(watchSetAddress);
  yield fork(watchSetNotification);
  yield fork(watchClearWallet);
  yield fork(watchWalletType);
  yield fork(watchBip44Path);
}
